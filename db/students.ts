import db from './db';
import { Student } from '../types/Student';
import { studentsTable } from './tables';
import date from '../utils/date';

type SignInResult =
  | { status: 'created', email: string }
  | { status: 'alreadyRegistered', email: string }
  | { status: 'conflict' };

const signIn = async (
  email: string,
  ine: string,
  firstNames: string,
): Promise<SignInResult> => {
  try {
    // email + ine are already in base for same student
    const existingStudent = await db(studentsTable)
      .where({ email, ine })
      .first();

    if (existingStudent) {
      return { status: 'alreadyRegistered', email };
    }

    // email or ine separately already used
    const [conflict] = await db(studentsTable)
      .where('email', email)
      .orWhere('ine', ine)
      .limit(1);

    if (conflict) {
      return { status: 'conflict' };
    }

    // if none of above, creating student
    await db(studentsTable)
      .insert({
        email,
        ine,
        firstNames,
        createdAt: date.now(),
      })
      .returning('*') as Student[];

    return { status: 'created', email };
  } catch (err) {
    console.error('Error while creating student', err);
    throw new Error('Erreur lors de la création de l’étudiant');
  }
};

const getStudentById = async (studentId: string): Promise<Student> => {
  try {
    const student = await db(studentsTable)
      .where('id', studentId)
      .first();
    return student;
  } catch (err) {
    console.error("Impossible de récupérer l'étudiant", err);
    throw new Error("Impossible de récupérer l'étudiant");
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

export default {
  signIn,
  getStudentById,
  getStudentByEmail,
};
