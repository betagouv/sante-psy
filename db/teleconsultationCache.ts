import { teleconsultationCacheTable } from './tables';
import db from './db';

export type CacheEntry = {
  id: number;
  psychologistId: string;
  psychologistName: string;
  doctolibUrl: string;
  nextSlot: Date | null;
  lastSlotCheckedAt: Date | null;
  lastFullRefreshAt: Date | null;
};

const getTop5 = async (): Promise<CacheEntry[]> => db(teleconsultationCacheTable)
  .whereNotNull('nextSlot')
  .where('nextSlot', '>=', new Date())
  .orderBy('nextSlot', 'asc')
  .limit(5);

const getLastFullRefreshAt = async (): Promise<Date | null> => {
  const row = await db(teleconsultationCacheTable)
    .whereNotNull('lastFullRefreshAt')
    .orderBy('lastFullRefreshAt', 'desc')
    .select('lastFullRefreshAt')
    .first();
  return row ? row.lastFullRefreshAt : null;
};

const upsertSlot = async (
  psychologistId: string,
  psychologistName: string,
  doctolibUrl: string,
  nextSlot: string | null,
  isFullRefresh = false,
): Promise<void> => {
  const existing = await db(teleconsultationCacheTable)
    .where({ psychologistId })
    .first();

  const now = new Date();
  const updateData: Record<string, unknown> = {
    psychologistName,
    doctolibUrl,
    nextSlot: nextSlot || null,
    lastSlotCheckedAt: now,
    updated_at: now,
  };
  if (isFullRefresh) {
    updateData.lastFullRefreshAt = now;
  }

  if (existing) {
    await db(teleconsultationCacheTable)
      .where({ psychologistId })
      .update(updateData);
  } else {
    await db(teleconsultationCacheTable).insert({
      psychologistId,
      ...updateData,
      created_at: now,
    });
  }
};

const deleteAll = async (): Promise<void> => {
  await db(teleconsultationCacheTable).delete();
};

export default {
  getTop5,
  getLastFullRefreshAt,
  upsertSlot,
  deleteAll,
};
