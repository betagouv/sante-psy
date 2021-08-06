import date from '../utils/date';
import { loginTokenTable } from './tables';
import db from './db';
import { LoginToken } from '../types/LoginToken';

const getByToken = async (token: string): Promise<LoginToken> => {
  try {
    const result = await db(loginTokenTable)
    .where('token', token)
    .andWhere('expiresAt', '>', date.now())
    .first();

    return result;
  } catch (err) {
    console.error('Impossible de récupérer le token', err);
    throw new Error('Une erreur est survenue.');
  }
};

const getByEmail = async (email: string): Promise<LoginToken> => {
  try {
    const result = await db(loginTokenTable)
    .where('email', email)
    .first();

    return result;
  } catch (err) {
    console.error('Impossible de récupérer le token', err);
    throw new Error('Une erreur est survenue.');
  }
};

const insert = async (token: string, email: string, expiresAt: string): Promise<LoginToken> => {
  try {
    return await db(loginTokenTable).insert({
      token,
      email,
      expiresAt,
    });
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
};

const deleteOne = async (token: string): Promise<void> => {
  try {
    const deletedToken = await db(loginTokenTable)
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
  getByToken,
  getByEmail,
  insert,
  delete: deleteOne,
};
