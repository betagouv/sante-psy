import date from '../utils/date';
import { patientsTable } from './tables';
import db from './db';
import { Patient } from '../types/Patient';

const getById = async (
  patientId: string,
  psychologistId: string,
): Promise<Patient> => {
  try {
    const patient = await db(patientsTable)
      .where('id', patientId)
      .where('psychologistId', psychologistId)
      .first();

    return patient;
  } catch (err) {
    console.error('Erreur de récupération du patient', err);
    throw new Error('Erreur de récupération du patient');
  }
};

const getAll = async (
  psychologistId: string,
): Promise<
  (Patient & { appointmentsCount: string; appointmentsYearCount: string })[]
> => {
  try {
    // Get all patients of psychologist
    const patients = await db
      .select('*')
      .from(patientsTable)
      .where('psychologistId', psychologistId)
      .andWhere('deleted', false);

    return patients;
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
      throw new Error('Cet étudiant est déjà un patient de ce psychologue');
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
};
