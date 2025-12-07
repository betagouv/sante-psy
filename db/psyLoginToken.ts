import date from '../utils/date';
import { psyLoginTokenTable } from './tables';
import db from './db';
import { PsyLoginToken } from '../types/PsyLoginToken';

const getPsyByToken = async (token: string): Promise<PsyLoginToken> => {
  try {
    const result = await db(psyLoginTokenTable)
    .where('token', token)
    .andWhere('expiresAt', '>', date.now())
    .first();

    return result || null;
  } catch (err) {
    console.error('Impossible de récupérer le token', err);
    throw new Error('Une erreur est survenue.');
  }
};

const getPsyByEmail = async (email: string): Promise<PsyLoginToken> => {
  try {
    const result = await db(psyLoginTokenTable)
    .where('email', email)
    .first();

    return result || null;
  } catch (err) {
    console.error('Impossible de récupérer le token', err);
    throw new Error('Une erreur est survenue.');
  }
};

const insertPsy = async (token: string, email: string, expiresAt: string): Promise<PsyLoginToken> => {
  try {
    return await db(psyLoginTokenTable).insert({
      token,
      email,
      expiresAt,
    });
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
};

const deleteOnePsy = async (token: string): Promise<void> => {
  try {
    const deletedToken = await db(psyLoginTokenTable)
    .where({
      token,
    })
    .del()
    .returning('*');

    if (deletedToken.length === 0) {
      console.error('token not deleted : does not exist or is not allowed');
      throw new Error('token not deleted : does not exist or is not allowed');
    }
  } catch (err) {
    console.error(`Erreur de suppression du token : ${err}`);
    throw new Error('Erreur de suppression du token');
  }
};

export default {
  getPsyByToken,
  getPsyByEmail,
  insert: insertPsy,
  delete: deleteOnePsy,
};
