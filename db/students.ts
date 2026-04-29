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
    const normalizedEmail = email.toLowerCase();

    // email + ine are already in base for same student
    const existingStudent = await db(studentsTable)
      .whereRaw('LOWER(email) = ?', [normalizedEmail])
      .where({ ine })
      .first();

    if (existingStudent) {
      return { status: 'alreadyRegistered' };
    }

    // email or ine separately already used
    const [conflict] = await db(studentsTable)
      .whereRaw('LOWER(email) = ?', [normalizedEmail])
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

type CreateStudentParams = {
  email: string;
  ine: string;
  firstNames: string;
  lastName: string;
  dateOfBirth: Date;
  acceptedCGUs?: boolean;
  schoolType?: string;
  schoolName?: string;
  schoolPostcode?: string;
  studyLevel?: string;
  studyField?: string;
  studyFieldOther?: string;
  gender?: string;
  livingPostcode?: string;
};

const create = async ({
  email,
  ine,
  firstNames,
  lastName,
  dateOfBirth,
  acceptedCGUs,
  schoolType,
  schoolName,
  schoolPostcode,
  studyLevel,
  studyField,
  studyFieldOther,
  gender,
  livingPostcode,
}: CreateStudentParams): Promise<Student> => {
  try {
    const [student] = (await db(studentsTable)
      .insert({
        email,
        ine,
        firstNames,
        lastName,
        dateOfBirth,
        createdAt: date.now(),
        has_accepted_cgu: acceptedCGUs,
        school_type: schoolType,
        school_name: schoolName,
        study_level: studyLevel,
        study_field: studyField,
        study_field_other: studyFieldOther,
        gender,
        school_postcode: schoolPostcode,
        living_postcode: livingPostcode,
      })
      .returning('*')) as Student[];

    return student;
  } catch (err) {
    console.error('Error while creating student', err);
    throw new Error("Erreur lors de la création de l'étudiant");
  }
};

const getById = async (studentId: string): Promise<Student> => {
  try {
    const student = await db(studentsTable).where('id', studentId).first();
    return student;
  } catch (err) {
    console.error('Error while getting the student by id', err);
    throw new Error("Erreur lors de la récupération de l'étudiant par id");
  }
};

const getByEmail = async (email: string): Promise<Student> => {
  try {
    const result = await db(studentsTable).where('email', email).first();

    return result;
  } catch (err) {
    console.error('Error while getting the student by email', err);
    throw new Error("Erreur lors de la récupération de l'étudiant par email");
  }
};

const getByEmailAndIne = async (
  ine: string,
  email: string,
): Promise<Student | null> => {
  try {
    const result = await db(studentsTable)
      .where('email', email)
      .andWhere('ine', ine)
      .first();
    return result;
  } catch (err) {
    console.error('Error while getting the student by email and ine', err);
    return null;
  }
};

export default {
  checkDuplicates,
  create,
  getById,
  getByEmail,
  getByEmailAndIne,
};
