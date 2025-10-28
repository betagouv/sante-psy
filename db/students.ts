import db from './db';
import date from '../utils/date';
import { Student } from '../types/Student';
import { studentsTable } from './tables';

type SignInResult =
  | { status: 'created', email: string }
  | { status: 'alreadyRegistered', email: string }
  | { status: 'accountNotActivated', email: string }
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
      if (existingStudent.activated) {
        return { status: 'alreadyRegistered', email: existingStudent.email };
      }
      return { status: 'accountNotActivated', email: existingStudent.email };
    }

    // email or ine already used
    const [conflict] = await db(studentsTable)
      .where('email', email)
      .orWhere('ine', ine)
      .limit(1);

    if (conflict) {
      return { status: 'conflict' };
    }

    // creating student
    const [newStudent] = await db(studentsTable)
      .insert({
        email,
        ine,
        firstNames,
        activated: false,
        createdAt: date.now(),
      })
      .returning('*') as Student[];

    return { status: 'created', email: newStudent.email };
  } catch (err) {
    console.error('Error while creating student', err);
    throw new Error('Erreur lors de la création de l’étudiant');
  }
};

export default {
  signIn,
};
