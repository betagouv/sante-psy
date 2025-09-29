import date from '../utils/date';
import { dsApiCursorTable } from './tables';
import db from './db';

const getCursorFromDB = async (): Promise<string | undefined> => {
  try {
    const lastCursor = await db(dsApiCursorTable)
    .where('id', 1)
    .first();

    console.debug(`getLatestCursorSaved: Got the latest cursor saved in PG ${JSON.stringify(lastCursor)}`);
    if (lastCursor) {
      return lastCursor.cursor;
    }
    return undefined;
  } catch (err) {
    // not a blocking error
    console.error('Impossible de récupèrer le dernier cursor de l\'api DS, le cron ne va pas utilser de cursor', err);
    return undefined;
  }
};

/**
 * l'API DS nous retourne 100 éléments à chaque appel, et nous indique la page où l'on se trouve
 * en stockant la dernière page lue (cursor), on limite le nombre d'appel à l'API en ne lisant que
 * les pages necessaires
 * @param updateEverything : boolean, if true do not use latest cursor 
 */
const getLatestCursorSaved = (updateEverything = false): Promise<string | undefined> => {
  if (!updateEverything) {
    return getCursorFromDB();
  }
  console.log(`Not using cursor saved inside PG due to parameter ${updateEverything}`);

  return undefined;
};

const saveLatestCursor = async (cursor: string): Promise<void> => {
  const trx = await db.transaction();
  try {
    const now = date.now();

    const alreadySavedCursor = await getCursorFromDB();
    if (alreadySavedCursor) {
      console.log(`Updating the cursor ${cursor} in PG`);
      await trx(dsApiCursorTable)
        .where('id', 1)
        .update({
          cursor,
          updatedAt: now,
        });
    } else {
      console.log(`Saving a new cursor ${cursor} to PG`);
      await trx(dsApiCursorTable).insert({
        id: 1,
        cursor,
        updatedAt: now,
      });
    }
    await trx.commit();
  } catch (err) {
    await trx.rollback();
    console.error(`Impossible de sauvegarder le dernier cursor ${cursor} de l'api DS`, err);
    throw new Error('Impossible de sauvegarder le dernier cursor de l\'api DS');
  }
};

export default { getLatestCursorSaved, saveLatestCursor };
