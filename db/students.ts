import { studentsTable } from './tables';
import db from './db';

const insert = async (email: string): Promise<void> => {
  try {
    await db(studentsTable).insert({ email }).onConflict('email').ignore();
  } catch (err) {
    console.error('Erreur de sauvegarde du mail', err);
    throw new Error('Erreur de sauvegarde du mail');
  }
};

const getAllMailBetween = async (from: Date, to: Date): Promise<string[]> => {
  try {
    return db.column('email')
    .select()
    .from(studentsTable)
    .whereBetween('createdAt', [from, to]);
  } catch (err) {
    console.error('Erreur lors de la récuperation des étudiants', err);
    throw new Error('Erreur lors de la récuperation des étudiants');
  }
};

export default {
  insert,
  getAllMailBetween,
};
