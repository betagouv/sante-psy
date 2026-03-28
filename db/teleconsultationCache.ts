import { teleconsultationSlotsTable } from './tables';
import db from './db';

export type SlotEntry = {
  id: number;
  psychologistId: string;
  psychologistName: string;
  doctolibUrl: string;
  slotDatetime: Date;
  lastFullRefreshAt: Date | null;
};

/** Retourne les N prochains créneaux futurs triés par date croissante (liste plate). */
const getTopN = async (n: number): Promise<SlotEntry[]> => db(teleconsultationSlotsTable)
  .where('slotDatetime', '>=', new Date())
  .orderBy('slotDatetime', 'asc')
  .limit(n);

/** Retourne le nombre de créneaux futurs en cache pour un psy donné. */
const getSlotCount = async (psychologistId: string): Promise<number> => {
  const row = await db(teleconsultationSlotsTable)
    .where({ psychologistId })
    .where('slotDatetime', '>=', new Date())
    .count('id as count')
    .first();
  return Number(row?.count ?? 0);
};

/** Timestamp du dernier refresh complet (max de lastFullRefreshAt sur toute la table). */
const getLastFullRefreshAt = async (): Promise<Date | null> => {
  const row = await db(teleconsultationSlotsTable)
    .whereNotNull('lastFullRefreshAt')
    .max('lastFullRefreshAt as lastFullRefreshAt')
    .first();
  return row?.lastFullRefreshAt ?? null;
};

/**
 * Remplace tous les créneaux d'un psy par les nouveaux slots fournis.
 * Si `isFullRefresh` est true, renseigne lastFullRefreshAt sur chaque ligne insérée.
 */
const replaceSlots = async (
  psychologistId: string,
  psychologistName: string,
  doctolibUrl: string,
  slots: string[],
  isFullRefresh = false,
): Promise<void> => {
  await db(teleconsultationSlotsTable).where({ psychologistId }).delete();

  if (slots.length === 0) return;

  const now = new Date();
  const rows = slots.map(slot => ({
    psychologistId,
    psychologistName,
    doctolibUrl,
    slotDatetime: new Date(slot),
    lastFullRefreshAt: isFullRefresh ? now : null,
    created_at: now,
    updated_at: now,
  }));

  await db(teleconsultationSlotsTable).insert(rows);
};

/** Supprime un créneau précis par son id (créneau confirmé comme pris). */
const deleteSlot = async (id: number): Promise<void> => {
  await db(teleconsultationSlotsTable).where({ id }).delete();
};

/** Supprime tous les créneaux d'un psy (compteur tombé à 0 ou profil introuvable). */
const deleteAllForPsy = async (psychologistId: string): Promise<void> => {
  await db(teleconsultationSlotsTable).where({ psychologistId }).delete();
};

/** Vide entièrement la table (avant un refresh complet). */
const deleteAll = async (): Promise<void> => {
  await db(teleconsultationSlotsTable).delete();
};

export default {
  getTopN,
  getSlotCount,
  getLastFullRefreshAt,
  replaceSlots,
  deleteSlot,
  deleteAllForPsy,
  deleteAll,
};
