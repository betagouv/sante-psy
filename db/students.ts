import { studentsTable } from './tables';
import db from './db';

const insert = async (email: string): Promise<void> => {
  try {
    const existingMail = await db
      .from(studentsTable)
      .where(`${studentsTable}.email`, email);

    if (existingMail.length === 0) {
      await db(studentsTable).insert({
        email,
      });
    }
  } catch (err) {
    console.error('Erreur de sauvegarde du mail', err);
    throw new Error('Erreur de sauvegarde du mail');
  }
};

export default {
  insert,
};
