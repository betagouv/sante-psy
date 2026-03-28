/**
 * Service d'interrogation de l'API publique Doctolib pour récupérer les créneaux de
 * téléconsultation disponibles.
 *
 * Doctolib est protégé par Cloudflare. On tente les appels avec des en-têtes qui
 * ressemblent à ceux d'un vrai navigateur Chrome. Si le serveur de production
 * Scalingo est bloqué (403), les fonctions retournent null et le backend dégrade
 * gracieusement (affiche le lien Doctolib sans créneau).
 */

import dbPsychologists from '../db/psychologists';
import teleconsultationCache, { CacheEntry } from '../db/teleconsultationCache';
import { Psychologist } from '../types/Psychologist';

const DOCTOLIB_BASE = 'https://www.doctolib.fr';
const SSF_URL = `${DOCTOLIB_BASE}/online_booking/api/slot_selection_funnel/v1/info.json`;
const AVAIL_URL = `${DOCTOLIB_BASE}/availabilities.json`;
const RATE_MS = 250; // ~4 req/s

const HEADERS: Record<string, string> = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'application/json, text/plain, */*',
  'Accept-Language': 'fr-FR,fr;q=0.9',
  Referer: `${DOCTOLIB_BASE}/`,
};

// ── Rate limiter (token bucket) ─────────────────────────────────────────────

let nextAllowedAt = 0;

const throttledFetch = async (url: string, signal?: AbortSignal): Promise<Response> => {
  const now = Date.now();
  const wait = Math.max(0, nextAllowedAt - now);
  nextAllowedAt = Math.max(now, nextAllowedAt) + RATE_MS;

  if (wait > 0) {
    await new Promise<void>(resolve => setTimeout(resolve, wait));
  }

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

// ── Étape 1 : métadonnées Doctolib (agenda + motif téléconsultation) ─────────

export const fetchDoctolibMeta = async (
  doctolibUrl: string,
  signal?: AbortSignal,
): Promise<DoctolibMeta | null> => {
  try {
    const slug = extractSlug(doctolibUrl);
    const url = `${SSF_URL}?profile_slug=${encodeURIComponent(slug)}&locale=fr`;
    const resp = await throttledFetch(url, signal);

    if (!resp.ok) return null;

    const data = await resp.json();
    const root = data.data ?? data;
    const agendas: Array<{ id: number; practice_id: number }> = root.agendas ?? [];
    const visitMotives: Array<{ id: number; name: string; telehealth: boolean }> =
      root.visit_motives ?? [];

    if (!agendas.length || !visitMotives.length) return null;

    const telehealth = visitMotives.filter(m => m.telehealth);
    if (!telehealth.length) return null;

    const motive =
      telehealth.find(m => m.name.toLowerCase().includes('nouveau')) ?? telehealth[0];

    return {
      agendaIds: agendas.map(a => a.id).join('-'),
      practiceId: agendas[0].practice_id,
      visitMotiveId: motive.id,
    };
  } catch {
    return null;
  }
};

// ── Étape 2 : prochain créneau disponible ─────────────────────────────────────

export const fetchNextSlot = async (
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
      limit: '3',
    });

    const resp = await throttledFetch(`${AVAIL_URL}?${params.toString()}`, signal);
    if (!resp.ok) return null;

    const data = await resp.json();
    return (data.next_slot as string) ?? null;
  } catch {
    return null;
  }
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

    await teleconsultationCache.deleteAll();

    for (const psy of psysWithLink) {
      const name = `${psy.lastName} ${psy.firstNames}`.trim();
      const meta = await fetchDoctolibMeta(psy.doctolibUrl);
      if (!meta) {
        await teleconsultationCache.upsertSlot(
          psy.dossierNumber, name, psy.doctolibUrl, null, true,
        );
        continue;
      }
      const slot = await fetchNextSlot(meta);
      await teleconsultationCache.upsertSlot(
        psy.dossierNumber, name, psy.doctolibUrl, slot, true,
      );
    }
  } finally {
    refreshRunning = false;
  }
};

// ── Vérification des créneaux du top 5 en cache ───────────────────────────────

export const verifySlots = async (entries: CacheEntry[]): Promise<CacheEntry[]> => {
  const verified: CacheEntry[] = [];

  for (const entry of entries) {
    if (!entry.nextSlot) {
      verified.push({ ...entry, nextSlot: null });
      continue;
    }

    const meta = await fetchDoctolibMeta(entry.doctolibUrl);
    if (!meta) {
      // Impossible de vérifier : on conserve le créneau mis en cache
      verified.push(entry);
      continue;
    }

    const slot = await fetchNextSlot(meta);
    await teleconsultationCache.upsertSlot(
      entry.psychologistId,
      entry.psychologistName,
      entry.doctolibUrl,
      slot,
      false,
    );
    verified.push({ ...entry, nextSlot: slot ? new Date(slot) : null });
  }

  return verified.filter(e => e.nextSlot && e.nextSlot >= new Date());
};
