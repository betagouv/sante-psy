import { Request, Response } from 'express';
import teleconsultationSlots from '../db/teleconsultationCache';
import { runFullRefresh, verifySlots, isDoctolibBlocked } from '../services/doctolibAvailability';

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes
const RESULTS_COUNT = 5;

/** Formate les SlotEntry en objet lisible par le frontend (slotDatetime → nextSlot). */
const formatResults = (entries: Awaited<ReturnType<typeof teleconsultationSlots.getTopN>>) =>
  entries.map(e => ({
    psychologistId: e.psychologistId,
    psychologistName: e.psychologistName,
    doctolibUrl: e.doctolibUrl,
    nextSlot: e.slotDatetime,
  }));

const getFastestTeleconsultation = async (_req: Request, res: Response): Promise<void> => {
  // Si Doctolib bloque les requêtes serveur, on masque le bouton
  if (isDoctolibBlocked()) {
    res.json({ results: [], stale: false, blocked: true });
    return;
  }

  const lastRefreshAt = await teleconsultationSlots.getLastFullRefreshAt();
  const isStale =
    !lastRefreshAt || Date.now() - new Date(lastRefreshAt).getTime() > CACHE_TTL_MS;

  const topEntries = await teleconsultationSlots.getTopN(RESULTS_COUNT);
  const isEmpty = topEntries.length === 0;

  if (isEmpty) {
    // Premier appel : on attend le refresh complet avant de répondre
    await runFullRefresh();

    if (isDoctolibBlocked()) {
      res.json({ results: [], stale: false, blocked: true });
      return;
    }

    const results = await teleconsultationSlots.getTopN(RESULTS_COUNT);
    res.json({ results: formatResults(results), stale: false, blocked: false });
    return;
  }

  if (isStale) {
    // Cache périmé : réponse immédiate + refresh en arrière-plan
    res.json({ results: formatResults(topEntries), stale: true, blocked: false });
    runFullRefresh().catch(err => console.error('Erreur refresh Doctolib en arrière-plan :', err));
    return;
  }

  // Cache frais : vérification de la liste plate (supprime les créneaux pris,
  // re-fetche les psys à compteur 0, met à jour le cache)
  const blocked = await verifySlots();

  if (blocked) {
    res.json({ results: formatResults(topEntries), stale: false, blocked: true });
    return;
  }

  // Relit le top-5 après mise à jour : si un créneau est parti, son remplaçant
  // (même psy ou autre psy) est automatiquement remonté
  const results = await teleconsultationSlots.getTopN(RESULTS_COUNT);
  res.json({ results: formatResults(results), stale: false, blocked: false });
};

export default { getFastestTeleconsultation };
