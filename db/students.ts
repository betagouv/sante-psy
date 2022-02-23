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

export default {
  insert,
};
