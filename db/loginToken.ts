import { LoginToken } from '../types/LoginToken';
import date from '../utils/date';
import logs from '../utils/logs';
import db from './db';
import { loginTokenTable } from './tables';

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
    .andWhere('expiresAt', '>', date.now())
    .first();

    return result;
  } catch (err) {
    console.error('Impossible de récupérer le token', err);
    throw new Error('Une erreur est survenue.');
  }
};

const upsert = async (
  token: string,
  email: string,
  expiresAt: Date,
  role: 'psy' | 'student' = 'psy',
): Promise<LoginToken> => {
  try {
    const existing = await getByEmail(email);

    if (existing) {
      await db(loginTokenTable).where({ email }).del();
    }

    const [created] = await db(loginTokenTable)
    // TODO use .upsert() directly
      .insert({
        token,
        email,
        expiresAt,
        role,
      })
      .returning('*');

    return created;
  } catch (err) {
    console.error(`Erreur d'upsert du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
};

const deleteOne = async (token: string): Promise<void> => {
  try {
    const deletedToken = await db(loginTokenTable)
      .where({ token })
      .del()
      .returning('*');

    if (deletedToken.length === 0) {
      throw new Error('token not deleted : does not exist or is not allowed');
    }
  } catch (err) {
    console.error(`Erreur de suppression du token : ${err}`);
    throw new Error('Erreur de suppression du token');
  }
};

const incrementAttempts = async (token: string): Promise<void> => {
  try {
    await db(loginTokenTable)
      .where({ token })
      .increment('signInAttempts', 1);
  } catch (err) {
    console.error('Erreur lors de l\'incrémentation des tentatives', err);
    throw new Error('Erreur lors de l\'incrémentation des tentatives');
  }
};

const deleteByEmail = async (email: string): Promise<void> => {
  try {
    await db(loginTokenTable)
      .where({ email })
      .del();

    console.log(`Login token deleted for email: ${logs.hash(email)}`);
  } catch (err) {
    console.error(`Erreur de suppression du token par email : ${err}`);
    throw new Error('Erreur de suppression du token');
  }
};

export default {
  getByToken,
  getByEmail,
  upsert,
  delete: deleteOne,
  incrementAttempts,
  deleteByEmail,
};
