import { Request, Response } from 'express';
import teleconsultationCache from '../db/teleconsultationCache';
import { runFullRefresh, verifySlots, isDoctolibBlocked } from '../services/doctolibAvailability';

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

const getFastestTeleconsultation = async (_req: Request, res: Response): Promise<void> => {
  // Si Doctolib bloque les requêtes serveur, on ne renvoie rien
  if (isDoctolibBlocked()) {
    res.json({ results: [], stale: false, blocked: true });
    return;
  }

  const top5 = await teleconsultationCache.getTop5();
  const lastRefreshAt = await teleconsultationCache.getLastFullRefreshAt();

  const isStale =
    !lastRefreshAt || Date.now() - new Date(lastRefreshAt).getTime() > CACHE_TTL_MS;

  const isEmpty = top5.length === 0;

  if (isEmpty) {
    // Premier appel : on attend le refresh complet avant de répondre
    await runFullRefresh();

    if (isDoctolibBlocked()) {
      res.json({ results: [], stale: false, blocked: true });
      return;
    }

    const results = await teleconsultationCache.getTop5();
    res.json({ results, stale: false, blocked: false });
    return;
  }

  if (isStale) {
    // Cache périmé : on répond immédiatement avec les données en cache
    // et on lance le refresh en arrière-plan
    res.json({ results: top5, stale: true, blocked: false });
    // fire-and-forget
    runFullRefresh().catch(err => console.error('Erreur refresh Doctolib en arrière-plan :', err));
    return;
  }

  // Cache frais (< 15 min) : on vérifie que les 5 créneaux existent encore
  const verified = await verifySlots(top5);

  if (isDoctolibBlocked()) {
    // La vérification a détecté un blocage : on renvoie le cache tel quel
    res.json({ results: top5, stale: false, blocked: true });
    return;
  }

  res.json({ results: verified, stale: false, blocked: false });
};

export default { getFastestTeleconsultation };
