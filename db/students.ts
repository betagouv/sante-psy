import db from './db';
import date from '../utils/date';
import { Student } from '../types/Student';
import { studentsTable } from './tables';

type SignInResult =
  | { status: 'created', email: string }
  | { status: 'alreadyRegistered', email: string }
  | { status: 'accountNotValidated', email: string }
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
      if (existingStudent.validated) {
        return { status: 'alreadyRegistered', email: existingStudent.email };
      }
      return { status: 'accountNotValidated', email: existingStudent.email };
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
        validated: false,
        createdAt: date.now(),
      })
      .returning('*') as Student[];

    return { status: 'created', email: newStudent.email };
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
