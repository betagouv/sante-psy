import db from './db';
import { Student } from '../types/Student';
import { studentsTable } from './tables';
import date from '../utils/date';

type DuplicateCheckResult =
  | { status: 'alreadyRegistered' }
  | { status: 'conflict' }
  | { status: 'available' };

const checkDuplicates = async (
  email: string,
  ine: string,
): Promise<DuplicateCheckResult> => {
  try {
    // email + ine are already in base for same student
    const existingStudent = await db(studentsTable)
      .where({ email, ine })
      .first();

    if (existingStudent) {
      return { status: 'alreadyRegistered' };
    }

    // email or ine separately already used
    const [conflict] = await db(studentsTable)
      .where('email', email)
      .orWhere('ine', ine)
      .limit(1);

    if (conflict) {
      return { status: 'conflict' };
    }

    return { status: 'available' };
  } catch (err) {
    console.error('Error while checking duplicates', err);
    throw new Error('Erreur lors de la vérification des doublons');
  }
};

const create = async (
  email: string,
  ine: string,
  firstNames: string,
  lastName: string,
  dateOfBirth: Date,
): Promise<Student> => {
  try {
    const [student] = await db(studentsTable)
      .insert({
        email,
        ine,
        firstNames,
        lastName,
        dateOfBirth,
        createdAt: date.now(),
      })
      .returning('*') as Student[];

    return student;
  } catch (err) {
    console.error('Error while creating student', err);
    throw new Error("Erreur lors de la création de l'étudiant");
  }
};

const getById = async (studentId: string): Promise<Student> => {
  try {
    const student = await db(studentsTable)
      .where('id', studentId)
      .first();
    return student;
  } catch (err) {
    console.error('Error while getting the student by id', err);
    throw new Error("Erreur lors de la récupération de l'étudiant par id");
  }
};

const getByEmail = async (email: string): Promise<Student> => {
  try {
    const result = await db(studentsTable)
    .where('email', email)
    .first();

    return result;
  } catch (err) {
    console.error('Error while getting the student by email', err);
    throw new Error("Erreur lors de la récupération de l'étudiant par email");
  }
};

export default {
  checkDuplicates,
  create,
  getById,
  getByEmail,
};
