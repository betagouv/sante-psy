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

const insert = async (token: string, email: string, expiresAt: string): Promise<StudentLoginToken> => {
  try {
    return await db(studentsLoginTokenTable).insert({
      token,
      email,
      expiresAt,
    });
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
};

const update = async (email: string, expiresAt: string): Promise<void> => {
  try {
    const updated = await db(studentsLoginTokenTable)
      .where({ email })
      .update({ expiresAt });

    if (!updated) throw new Error('Aucune entrée mise à jour');
  } catch (err) {
    console.error(`Erreur de mise à jour du token : ${err}`);
    throw new Error('Erreur de mise à jour du token');
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
  insert,
  update,
  delete: deleteOne,
};
