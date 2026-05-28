import date from '../utils/date';
import { patientsTable } from './tables';
import db from './db';
import { Patient } from '../types/Patient';
import { Student } from '../types/Student';

export const ERROR_MESSAGE_STUDENT_ALREADY_PATIENT =
  'Cet étudiant est déjà un patient de ce psychologue';

const enrichPatientWithStudent = (
  patient: Patient,
  student: Student | null,
): Patient => ({
  ...patient,
  student,
  firstNames: student?.firstNames ?? patient.firstNames,
  lastName: student?.lastName ?? patient.lastName,
  INE: student?.ine ?? patient.INE,
});

const getById = async (
  patientId: string,
  psychologistId: string,
): Promise<Patient> => {
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

    return enrichPatientWithStudent(patient, student);
  } catch (err) {
    console.error('Erreur de récupération du patient', err);
    throw new Error('Erreur de récupération du patient');
  }
};

const getByStudentId = async (
  studentId: string,
  psychologistId: string,
): Promise<Patient> => {
  const patient = await db(patientsTable)
    .where('student_id', studentId)
    .where('psychologistId', psychologistId)
    .first();
  return patient;
};

const getAll = async (
  psychologistId: string,
): Promise<
  (Patient & {
    appointmentsCount: string;
    appointmentsYearCount: string;
  })[]
> => {
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

    return patients.map((p) => {
      const student = p.student_id
        ? (studentsById[p.student_id] ?? null)
        : null;
      return enrichPatientWithStudent(p, student) as Patient & {
        appointmentsCount: string;
        appointmentsYearCount: string;
      };
    });
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
    const [patient] = await db(patientsTable)
      .insert({
        student_id: studentId,
        psychologistId,
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

export default {
  getById,
  getAll,
  insert,
  delete: deleteOne,
  getByStudentEmailAndIne,
  getByStudentId,
};
