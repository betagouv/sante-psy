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
    console.error('Impossible de récupèrer le dernier cursor de l\'api DS, le cron ne va pas utilser de cursor', err);

    return undefined; // not a blocking error
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
  try {
    const now = date.now();

    const alreadySavedCursor = await module.exports.getCursorFromDB();
    // eslint-disable-next-line func-names
    return await db.transaction((trx) => { // add transaction in case 2 cron jobs modify this cursor
      if (alreadySavedCursor) {
        console.log(`Updating the cursor ${cursor} in PG`);

        return trx.into(dsApiCursorTable)
        .where('id', 1)
        .update({
          cursor,
          updatedAt: now,
        });
      } // no cursor already saved, we are going to create one entry
      console.log(`Saving a new cursor ${cursor} to PG`);

      return trx.into(dsApiCursorTable).insert({
        id: 1,
        cursor,
        updatedAt: now,
      });
    });
  } catch (err) {
    console.error(`Impossible de sauvegarder le dernier cursor ${cursor} de l'api DS`, err);
    throw new Error('Impossible de sauvegarder le dernier cursor de l\'api DS');
  }
};

export default { getLatestCursorSaved, saveLatestCursor };
