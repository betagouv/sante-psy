import db from './db';
import { Student } from '../types/Student';
import { studentsTable } from './tables';
import date from '../utils/date';
import { Patient } from '../types/Patient';

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
  apiInesCheck: boolean;
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
  apiInesCheck = false,
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
        api_ines_check: apiInesCheck,
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

const savePendingEmailChange = async (
  studentId: string,
  pendingEmail: string,
  token: string,
  expiresAt: Date,
): Promise<string> => {
  try {
    await db(studentsTable).where({ id: studentId }).update({
      pending_email: pendingEmail.toLowerCase(),
      pending_email_token: token,
      pending_email_expiration_date: expiresAt,
    });

    return token;
  } catch (err) {
    console.error('Error while saving pending email change', err);
    throw new Error(
      "Erreur lors de la sauvegarde de la demande de changement d'email",
    );
  }
};

const getByEmailChangeToken = async (
  token: string,
): Promise<Student | null> => {
  try {
    const student = await db(studentsTable)
      .where({ pending_email_token: token })
      .where('pending_email_expiration_date', '>', new Date())
      .first();

    return student ?? null;
  } catch (err) {
    console.error('Error while getting student by email change token', err);
    throw new Error('Erreur lors de la vérification du token');
  }
};

const confirmEmailChange = async (studentId: string): Promise<void> => {
  try {
    const student = await db(studentsTable).where({ id: studentId }).first();

    await db(studentsTable).where({ id: studentId }).update({
      email: student.pending_email,
      pending_email: null,
      pending_email_token: null,
      pending_email_expiration_date: null,
    });
  } catch (err) {
    console.error('Error while confirming email change', err);
    throw new Error("Erreur lors de la confirmation du changement d'email");
  }
};

const deleteEmailChangeInfo = async (token: string): Promise<void> => {
  await db(studentsTable).where({ pending_email_token: token }).update({
    pending_email: null,
    pending_email_token: null,
    pending_email_expiration_date: null,
  });
};

type UpdatePersonalDataParams = {
  acceptedCGUs?: boolean;
  schoolType?: string;
  schoolName?: string;
  schoolPostcode?: string;
  studyLevel?: string;
  studyField?: string;
  studyFieldOther?: string | null;
  gender?: string;
  livingPostcode?: string;
};

const updatePersonalData = async (
  studentId: string,
  {
    acceptedCGUs,
    schoolType,
    schoolName,
    schoolPostcode,
    studyLevel,
    studyField,
    studyFieldOther,
    gender,
    livingPostcode,
  }: UpdatePersonalDataParams,
): Promise<number> => {
  try {
    const updated = await db(studentsTable).where({ id: studentId }).update({
      has_accepted_cgu: acceptedCGUs,
      school_type: schoolType,
      school_name: schoolName,
      school_postcode: schoolPostcode,
      study_level: studyLevel,
      study_field: studyField,
      study_field_other: studyFieldOther,
      gender,
      living_postcode: livingPostcode,
      last_update_personal_data: date.now(),
    });

    return updated;
  } catch (err) {
    console.error('Error while updating student personal data', err);
    throw new Error("Erreur lors de la mise à jour des données de l'étudiant");
  }
};

const getByIneAndBirthDate = async (
  ine: string,
  birthDate: string | Date,
): Promise<Student | null> => {
  try {
    const result = await db(studentsTable)
      .where('dateOfBirth', birthDate)
      .andWhere('ine', ine)
      .first();
    return result;
  } catch (err) {
    console.error('Error while getting the student by birthDate and ine', err);
    return null;
  }
};

const getFromPatient = async (
  patient: Patient,
): Promise<Student | undefined> => {
  try {
    if (patient.student_id) {
      return await db(studentsTable).where('id', patient.student_id).first();
    }
    return await getByIneAndBirthDate(patient.INE, patient.dateOfBirth);
  } catch (err) {
    console.error('Error while getting a student from a patient', err);
    return undefined;
  }
};

export default {
  checkDuplicates,
  create,
  getById,
  getByEmail,
  getByEmailAndIne,
  savePendingEmailChange,
  getByEmailChangeToken,
  confirmEmailChange,
  deleteEmailChangeInfo,
  updatePersonalData,
  getByIneAndBirthDate,
  getFromPatient,
};
