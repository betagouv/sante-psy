import date from '../utils/date';
import { patientsTable } from './tables';
import db from './db';
import { EnrichedPatient, Patient } from '../types/Patient';
import { Student } from '../types/Student';
import { getStudentEligibility } from './studentEligibility';
import { getUnivYear } from '../utils/univYears';

export const ERROR_MESSAGE_STUDENT_ALREADY_PATIENT =
  'Cet étudiant est déjà un patient de ce psychologue';

const enrichPatientWithStudent = async (
  patient: Patient,
  student: Student | null,
): Promise<EnrichedPatient> => {
  if (!student) {
    return {
      ...patient,
      student: null,
    };
  }
  const studentEligibility = await getStudentEligibility(
    student,
    getUnivYear(new Date()),
  );
  return {
    ...patient,
    student: {
      ...student,
      eligibility: studentEligibility,
    },
    firstNames: student.firstNames,
    lastName: student.lastName,
    INE: student.ine,
  };
};

const getById = async (
  patientId: string,
  psychologistId: string,
): Promise<EnrichedPatient> => {
  try {
    const patient = await db(patientsTable)
      .where('id', patientId)
      .where('psychologistId', psychologistId)
      .first();

    if (!patient) {
      return null;
    }

    const student = patient.student_id
      ? await db('students').where('id', patient.student_id).first()
      : null;

    return await enrichPatientWithStudent(patient, student);
  } catch (err) {
    console.error('Erreur de récupération du patient', err);
    throw new Error('Erreur de récupération du patient');
  }
};

const isAlreadyAPatient = async (
  studentId: string,
  psychologistId: string,
): Promise<boolean> => {
  const patient = await db(patientsTable)
    .where('student_id', studentId)
    .where('psychologistId', psychologistId)
    .where('deleted', false)
    .first();
  return !!patient;
};

const getAll = async (psychologistId: string): Promise<EnrichedPatient[]> => {
  try {
    // Get all patients of psychologist
    const patients = await db
      .select('*')
      .from(patientsTable)
      .where('psychologistId', psychologistId)
      .andWhere('deleted', false);

    const studentIds = patients.map((p) => p.student_id).filter(Boolean);
    const students = studentIds.length
      ? await db('students').whereIn('id', studentIds)
      : [];
    const studentsById = Object.fromEntries(students.map((s) => [s.id, s]));

    return await Promise.all(
      patients.map((p) => {
        const student = p.student_id
          ? (studentsById[p.student_id] ?? null)
          : null;
        return enrichPatientWithStudent(p, student);
      }),
    );
  } catch (err) {
    console.error('Impossible de récupérer les patients', err);
    throw new Error('Impossible de récupérer les patients');
  }
};

const insert = async (
  psychologistId: string,
  studentId: string,
): Promise<Patient> => {
  try {
    const existing = await db(patientsTable)
      .where('psychologistId', psychologistId)
      .where('student_id', studentId)
      .first();

    if (existing) {
      if (!existing.deleted) {
        throw new Error(ERROR_MESSAGE_STUDENT_ALREADY_PATIENT);
      }

      const [patient] = await db(patientsTable)
        .where('id', existing.id)
        .update({
          deleted: false,
          updatedAt: date.now(),
        })
        .returning('*');
      return patient;
    }

    const [patient] = await db(patientsTable)
      .insert({
        student_id: studentId,
        psychologistId,
        deleted: false,
      })
      .returning('*');
    return patient;
  } catch (err) {
    if (err.code === '23505' && err.constraint === 'uq_psy_student') {
      throw new Error(ERROR_MESSAGE_STUDENT_ALREADY_PATIENT);
    }
    console.error('Erreur lors de la création du patient', err);
    throw err;
  }
};

const deleteOne = async (
  id: string,
  psychologistId: string,
): Promise<number> => {
  try {
    const deletedPatient = await db(patientsTable)
      .where('id', id)
      .where('psychologistId', psychologistId)
      .update({
        deleted: true,
        updatedAt: date.now(),
      });

    console.log(`Patient id ${id} deleted by psy id ${psychologistId}`);

    return deletedPatient;
  } catch (err) {
    console.error('Erreur de suppression du patient', err);
    throw new Error('Erreur de suppression du patient');
  }
};

const getByStudentEmailAndIne = async (
  email: string,
  INE: string,
): Promise<Patient[]> => {
  try {
    return await db(patientsTable)
      .where({
        email,
        INE,
      })
      .andWhere('deleted', false);
  } catch (err) {
    console.error('Erreur récupération patients étudiant', err);
    throw new Error('Erreur récupération patients étudiant');
  }
};

const getByStudent = async (student: Student): Promise<Patient[]> => {
  try {
    return await db(patientsTable)
      .where('deleted', false)
      .andWhere((outer) => {
        outer.where('student_id', student.id).orWhere((inner) => {
          inner
            .where('INE', student.ine)
            .andWhere('dateOfBirth', student.dateOfBirth);
        });
      });
  } catch (err) {
    console.error('Erreur récupération patients étudiant', err);
    throw new Error('Erreur récupération patients étudiant');
  }
};

export default {
  getById,
  getAll,
  insert,
  delete: deleteOne,
  getByStudentEmailAndIne,
  isAlreadyAPatient,
  getByStudent,
};
