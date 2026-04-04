/**
 * Service d'interrogation de l'API publique Doctolib pour récupérer les créneaux de
 * téléconsultation disponibles.
 *
 * Doctolib est protégé par Cloudflare. On tente les appels avec des en-têtes qui
 * ressemblent à ceux d'un vrai navigateur Chrome.
 *
 * Détection de blocage : si >= 80 % des 10 premières requêtes SSF d'un refresh
 * retournent 403, on positionne doctolibBlocked = true. Le flag se réinitialise
 * au prochain refresh complet si les requêtes repassent.
 *
 * Cache multi-créneaux : pour chaque psy, on stocke TOUS les créneaux retournés
 * par l'API (limit=5 jours). La vérification itère la liste plate triée par date ;
 * un appel Doctolib n'est fait qu'au premier contact avec un psy par passe. Si le
 * compteur d'un psy tombe à 0, on le re-fetche immédiatement.
 */

import dbPsychologists from '../db/psychologists';
import teleconsultationSlots from '../db/teleconsultationCache';
import { Psychologist } from '../types/Psychologist';

const DOCTOLIB_BASE = 'https://www.doctolib.fr';
const SSF_URL = `${DOCTOLIB_BASE}/online_booking/api/slot_selection_funnel/v1/info.json`;
const AVAIL_URL = `${DOCTOLIB_BASE}/availabilities.json`;
const RATE_MS = 250; // ~4 req/s
const AVAIL_DAYS_LIMIT = 5; // jours de créneaux récupérés par psy

/** Nombre de requêtes SSF initiales utilisées pour détecter un blocage Cloudflare. */
const BLOCK_SAMPLE_SIZE = 10;
/** Proportion d'échecs (403/429) déclenchant le flag de blocage. */
const BLOCK_THRESHOLD = 0.8;

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'fr-FR,fr;q=0.9',
  Referer: `${DOCTOLIB_BASE}/`,
};

// ── Détection de blocage Cloudflare ──────────────────────────────────────────

let doctolibBlocked = false;

/** Retourne true si Doctolib bloque les requêtes serveur (Cloudflare WAF). */
export const isDoctolibBlocked = (): boolean => doctolibBlocked;

// ── Rate limiter (token bucket) ─────────────────────────────────────────────

let nextAllowedAt = 0;

const throttledFetch = async (url: string, signal?: AbortSignal): Promise<Response> => {
  const now = Date.now();
  const wait = Math.max(0, nextAllowedAt - now);
  nextAllowedAt = Math.max(now, nextAllowedAt) + RATE_MS;
  if (wait > 0) await new Promise<void>(resolve => setTimeout(resolve, wait));
  return fetch(url, { headers: HEADERS, signal });
};

// ── Types ────────────────────────────────────────────────────────────────────

type DoctolibMeta = {
  agendaIds: string;
  practiceId: number;
  visitMotiveId: number;
};

type PsyWithLink = {
  dossierNumber: string;
  firstNames: string;
  lastName: string;
  doctolibUrl: string;
};

type MetaResult =
  | { meta: DoctolibMeta; blocked: false }
  | { meta: null; blocked: boolean };

// ── Helpers ──────────────────────────────────────────────────────────────────

const extractSlug = (url: string): string => url.replace(/\/$/, '').split('/').pop() ?? '';

const extractDoctolibUrl = (
  psy: Pick<Psychologist, 'appointmentLink' | 'website'>,
): string | null => {
  for (const field of ['appointmentLink', 'website'] as const) {
    const val = (psy[field] ?? '').toLowerCase();
    if (val.includes('doctolib.fr')) {
      return (psy[field] as string).split('?')[0].replace(/\/$/, '');
    }
  }
  return null;
};

// ── Étape 1 : métadonnées Doctolib ───────────────────────────────────────────

const fetchDoctolibMetaWithBlockInfo = async (
  doctolibUrl: string,
  signal?: AbortSignal,
): Promise<MetaResult> => {
  try {
    const slug = extractSlug(doctolibUrl);
    const url = `${SSF_URL}?profile_slug=${encodeURIComponent(slug)}&locale=fr`;
    const resp = await throttledFetch(url, signal);

    if (resp.status === 403 || resp.status === 429) return { meta: null, blocked: true };
    if (!resp.ok) return { meta: null, blocked: false };

    const data = await resp.json();
    const root = data.data ?? data;
    const agendas: Array<{ id: number; practice_id: number }> = root.agendas ?? [];
    const visitMotives: Array<{ id: number; name: string; telehealth: boolean }> =
      root.visit_motives ?? [];

    if (!agendas.length || !visitMotives.length) return { meta: null, blocked: false };

    const telehealth = visitMotives.filter(m => m.telehealth);
    if (!telehealth.length) return { meta: null, blocked: false };

    const motive =
      telehealth.find(m => m.name.toLowerCase().includes('nouveau')) ?? telehealth[0];

    return {
      meta: {
        agendaIds: agendas.map(a => a.id).join('-'),
        practiceId: agendas[0].practice_id,
        visitMotiveId: motive.id,
      },
      blocked: false,
    };
  } catch {
    return { meta: null, blocked: false };
  }
};

// ── Étape 2 : tous les créneaux disponibles ───────────────────────────────────

/**
 * Retourne tous les créneaux disponibles pour un psy (sur AVAIL_DAYS_LIMIT jours),
 * triés par date croissante, dédupliqués.
 */
const fetchAllSlots = async (
  meta: DoctolibMeta,
  signal?: AbortSignal,
): Promise<string[]> => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const params = new URLSearchParams({
      start_date: today,
      visit_motive_ids: String(meta.visitMotiveId),
      agenda_ids: meta.agendaIds,
      practice_ids: String(meta.practiceId),
      telehealth: 'true',
      insurance_sector: 'public',
      limit: String(AVAIL_DAYS_LIMIT),
    });

    const resp = await throttledFetch(`${AVAIL_URL}?${params.toString()}`, signal);
    if (!resp.ok) return [];

    const data = await resp.json();

    // Collecte tous les slots depuis data.availabilities[].slots[]
    const slots = new Set<string>();
    for (const day of (data.availabilities ?? []) as Array<{ slots?: string[] }>) {
      for (const slot of (day.slots ?? [])) {
        slots.add(slot);
      }
    }
    // Inclut next_slot au cas où il ne serait pas dans availabilities
    if (data.next_slot) slots.add(data.next_slot as string);

    return [...slots].sort();
  } catch {
    return [];
  }
};

/**
 * Version "premier créneau seulement" utilisée lors de la vérification pour
 * savoir quel est le prochain créneau réel (sans stocker les suivants).
 */
const fetchNextSlotOnly = async (
  meta: DoctolibMeta,
  signal?: AbortSignal,
): Promise<string | null> => {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const params = new URLSearchParams({
      start_date: today,
      visit_motive_ids: String(meta.visitMotiveId),
      agenda_ids: meta.agendaIds,
      practice_ids: String(meta.practiceId),
      telehealth: 'true',
      insurance_sector: 'public',
      limit: '1',
    });
    const resp = await throttledFetch(`${AVAIL_URL}?${params.toString()}`, signal);
    if (!resp.ok) return null;
    const data = await resp.json();
    return (data.next_slot as string) ?? null;
  } catch {
    return null;
  }
};

// ── Re-fetch d'un seul psy (compteur tombé à 0) ───────────────────────────────

const refetchOnePsy = async (psy: PsyWithLink): Promise<void> => {
  const name = `${psy.lastName} ${psy.firstNames}`.trim();
  const result = await fetchDoctolibMetaWithBlockInfo(psy.doctolibUrl);
  if (!result.meta) return;
  const slots = await fetchAllSlots(result.meta);
  await teleconsultationSlots.replaceSlots(
    psy.dossierNumber, name, psy.doctolibUrl, slots, false,
  );
};

// ── Refresh complet (toutes les psys avec lien Doctolib) ─────────────────────

let refreshRunning = false;

export const runFullRefresh = async (): Promise<void> => {
  if (refreshRunning) return;
  refreshRunning = true;

  try {
    const allPsys = await dbPsychologists.getAllAcceptedWithTeleconsultation();

    const psysWithLink: PsyWithLink[] = allPsys
      .map(psy => {
        const url = extractDoctolibUrl(psy);
        if (!url) return null;
        return {
          dossierNumber: psy.dossierNumber,
          firstNames: psy.firstNames ?? '',
          lastName: psy.lastName ?? '',
          doctolibUrl: url,
        };
      })
      .filter((p): p is PsyWithLink => p !== null);

    await teleconsultationSlots.deleteAll();

    let sampleBlocked = 0;
    let sampleTotal = 0;

    for (const psy of psysWithLink) {
      const name = `${psy.lastName} ${psy.firstNames}`.trim();
      const result = await fetchDoctolibMetaWithBlockInfo(psy.doctolibUrl);

      // Détection de blocage sur les N premiers appels
      if (sampleTotal < BLOCK_SAMPLE_SIZE) {
        sampleTotal += 1;
        if (result.blocked) sampleBlocked += 1;
        if (sampleTotal === BLOCK_SAMPLE_SIZE) {
          doctolibBlocked = sampleBlocked / BLOCK_SAMPLE_SIZE >= BLOCK_THRESHOLD;
          if (doctolibBlocked) return;
        }
      }

      if (!result.meta) continue;

      const slots = await fetchAllSlots(result.meta);
      await teleconsultationSlots.replaceSlots(
        psy.dossierNumber, name, psy.doctolibUrl, slots, true,
      );
    }

    doctolibBlocked = false;
  } finally {
    refreshRunning = false;
  }
};

// ── Vérification de la liste plate (cache frais, < 15 min) ───────────────────

/**
 * Parcourt la liste plate triée par date. Pour chaque psy rencontré la première fois,
 * appelle Doctolib une seule fois. Les créneaux pris sont supprimés du cache.
 * Si le compteur d'un psy tombe à 0, il est immédiatement re-fetché.
 * Retourne true si un blocage Cloudflare a été détecté.
 */
export const verifySlots = async (): Promise<boolean> => {
  // Liste plate (multi-créneaux par psy) pour naviguer les slots pris sans appel Doctolib
  const candidates = await teleconsultationSlots.getFlatTopN(30);

  // verifiedPsys[psyId] = nextSlot retourné par Doctolib lors de cette passe
  const verifiedPsys = new Map<string, string | null>();
  let blockedCount = 0;

  // Index de toutes les psys pour pouvoir re-fetcher (dossierNumber → PsyWithLink)
  // On construit un Map paresseux depuis les entrées du cache
  const psyIndex = new Map<string, { dossierNumber: string; firstNames: string; lastName: string; doctolibUrl: string }>();
  for (const entry of candidates) {
    if (!psyIndex.has(entry.psychologistId)) {
      psyIndex.set(entry.psychologistId, {
        dossierNumber: entry.psychologistId,
        firstNames: '',
        lastName: entry.psychologistName,
        doctolibUrl: entry.doctolibUrl,
      });
    }
  }

  for (const entry of candidates) {
    const psyId = entry.psychologistId;

    if (verifiedPsys.has(psyId)) {
      // Ce psy a déjà été vérifié cette passe — on se base sur nextSlot connu
      const knownNext = verifiedPsys.get(psyId)!;
      if (knownNext === null) {
        await teleconsultationSlots.deleteSlot(entry.id);
        continue;
      }
      if (entry.slotDatetime < new Date(knownNext)) {
        // Ce créneau est antérieur au prochain connu de Doctolib → il a été pris
        await teleconsultationSlots.deleteSlot(entry.id);
        const count = await teleconsultationSlots.getSlotCount(psyId);
        if (count === 0) {
          const psyInfo = psyIndex.get(psyId);
          if (psyInfo) await refetchOnePsy(psyInfo);
        }
      }
      // Si slotDatetime >= knownNext → créneau encore valide, rien à faire
    } else {
      // Premier contact avec ce psy cette passe : appel Doctolib
      const metaResult = await fetchDoctolibMetaWithBlockInfo(entry.doctolibUrl);

      if (metaResult.blocked) {
        blockedCount += 1;
        verifiedPsys.set(psyId, entry.slotDatetime.toISOString()); // conservatif
        continue;
      }

      if (!metaResult.meta) {
        verifiedPsys.set(psyId, null);
        await teleconsultationSlots.deleteAllForPsy(psyId);
        continue;
      }

      const nextSlot = await fetchNextSlotOnly(metaResult.meta);
      verifiedPsys.set(psyId, nextSlot);

      if (nextSlot === null) {
        await teleconsultationSlots.deleteAllForPsy(psyId);
        continue;
      }

      if (entry.slotDatetime < new Date(nextSlot)) {
        // Créneau pris
        await teleconsultationSlots.deleteSlot(entry.id);
        const count = await teleconsultationSlots.getSlotCount(psyId);
        if (count === 0) {
          const psyInfo = psyIndex.get(psyId);
          if (psyInfo) await refetchOnePsy(psyInfo);
        }
      }
      // Si slotDatetime >= nextSlot → créneau encore valide
    }
  }

  // Si tous les appels ont été bloqués → flag global
  const uniquePsysChecked = [...verifiedPsys.keys()].filter(
    id => !verifiedPsys.get(id) || verifiedPsys.get(id) !== null,
  ).length;
  if (uniquePsysChecked > 0 && blockedCount === uniquePsysChecked) {
    doctolibBlocked = true;
    return true;
  }

  return false;
};
