import date from '../utils/date';
import { studentsLoginTokenTable } from './tables';
import db from './db';
import { StudentLoginToken } from '../types/StudentLoginToken';

const getByToken = async (token: string): Promise<StudentLoginToken> => {
  try {
    const result = await db(studentsLoginTokenTable)
    .where('token', token)
    .andWhere('expiresAt', '>', date.now())
    .first();

    return result;
  } catch (err) {
    console.error('Impossible de récupérer le token', err);
    throw new Error('Une erreur est survenue.');
  }
};

const getByEmail = async (email: string): Promise<StudentLoginToken> => {
  try {
    const result = await db(studentsLoginTokenTable)
    .where('email', email)
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
): Promise<StudentLoginToken> => {
  try {
    const existing = await getByEmail(email);

    if (existing) {
      await db(studentsLoginTokenTable)
        .where({ email })
        .update({ token, expiresAt });

      return {
        ...existing,
        token,
        expiresAt,
      };
    }

    const [created] = await db(studentsLoginTokenTable)
      .insert({ token, email, expiresAt })
      .returning('*');

    return created;
  } catch (err) {
    console.error(`Erreur d'upsert du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
};

const deleteOne = async (token: string): Promise<void> => {
  try {
    const deletedToken = await db(studentsLoginTokenTable)
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
  upsert,
  delete: deleteOne,
};
