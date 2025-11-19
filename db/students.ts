import db from './db';
import date from '../utils/date';
import { Student } from '../types/Student';
import { studentsTable } from './tables';

const signIn = async (
  email: string,
): Promise<{ status: 'created', email: string }> => {
  try {
    const existingStudent = await db(studentsTable)
      .where({ email })
      .first();

    if (existingStudent) {
      return { status: 'created', email };
    }

    await db(studentsTable)
      .insert({
        email,
        validated: false,
        createdAt: date.now(),
      })
      .returning('*') as Student[];

    return { status: 'created', email };
  } catch (err) {
    console.error('Error while creating student', err);
    throw new Error('Erreur lors de la création de l’étudiant');
  }
};

const getStudentByEmail = async (email: string): Promise<Student> => {
  try {
    const result = await db(studentsTable)
    .where('email', email)
    .first();

    return result;
  } catch (err) {
    console.error("Impossible de récupérer l'email", err);
    throw new Error('Une erreur est survenue.');
  }
};

const validateStudentAccount = async (email: string): Promise<void> => {
  try {
    await db(studentsTable)
      .where({ email })
      .update({
        validated: true,
      });
    console.log(`Compte étudiant validé pour ${email}`);
  } catch (err) {
    console.error(`Erreur lors de la validation du compte étudiant (${email})`, err);
    throw new Error('Erreur lors de la validation du compte.');
  }
};

export default {
  signIn,
  getStudentByEmail,
  validateStudentAccount,
};
