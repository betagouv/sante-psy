import date from '../utils/date';
import { patientsTable } from './tables';
import db from './db';
import { Patient } from '../types/Patient';

const getById = async (patientId: string, psychologistId: string): Promise<Patient> => {
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

const getAll = async (psychologistId: string): Promise<(Patient &
  { appointmentsCount: string, appointmentsYearCount: string })[]> => {
  try {
    // Get all patients of psychologist
    const patients = await db.select('*')
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
  firstNames: string,
  lastName: string,
  dateOfBirth: Date,
  gender: string,
  INE: string,
  isINESvalid: boolean,
  institutionName?: string,
  isStudentStatusVerified?: boolean,
  psychologistId?: string,
  doctorName?: string,
): Promise<Patient> => {
  try {
    const patientsArray = await db(patientsTable).insert({
      firstNames,
      lastName,
      dateOfBirth,
      gender,
      INE,
      isINESvalid,
      institutionName,
      isStudentStatusVerified,
      psychologistId,
      doctorName,
    }).returning('*');
    return patientsArray[0];
  } catch (err) {
    console.error('Erreur de sauvegarde du patient', err);
    throw new Error('Erreur de sauvegarde du patient');
  }
};

const update = async (
  id: string,
  firstNames: string,
  lastName: string,
  dateOfBirth: Date,
  gender: string,
  INE: string,
  isINESvalid: boolean,
  institutionName: string,
  isStudentStatusVerified: boolean,
  psychologistId: string,
  doctorName: string,
): Promise<number> => {
  try {
    return await db(patientsTable)
      .where('id', id)
      .where('psychologistId', psychologistId)
      .update({
        firstNames,
        lastName,
        dateOfBirth,
        gender,
        INE,
        institutionName,
        isStudentStatusVerified,
        psychologistId,
        doctorName,
        updatedAt: date.now(),
        isINESvalid,
      });
  } catch (err) {
    console.error('Erreur de modification du patient', err);
    throw new Error('Erreur de modification du patient');
  }
};

const updateIsINESValidOnly = async (patientId: string, isINESvalid: boolean): Promise<number> => db('patients')
    .where({ id: patientId })
    .update({ isINESvalid });

const deleteOne = async (id: string, psychologistId: string): Promise<number> => {
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

const updateCertificateChecked = async (patientId: string): Promise<void> => {
  try {
    await db('patients')
      .where({ id: patientId })
      .update({ isCertificateChecked: true });
  } catch (err) {
    console.error('Erreur lors de la mise à jour de la colonne isCertificateChecked', err);
    throw new Error('Erreur lors de la mise à jour de la colonne isCertificateChecked');
  }
};

export default {
  getById,
  getAll,
  insert,
  update,
  updateIsINESValidOnly,
  delete: deleteOne,
  updateCertificateChecked,
};
