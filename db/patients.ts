import date from '../utils/date';
import { appointmentsTable, patientsTable } from './tables';
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

const startCurrentUnivYear = (): string => {
  const SEPTEMBER = 8;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  if (currentMonth < SEPTEMBER) {
    return `${currentYear - 1}-09-01`;
  }
  return `${currentYear}-09-01`;
};

const endCurrentUnivYear = (): string => {
  const SEPTEMBER = 8;
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  if (currentMonth < SEPTEMBER) {
    return `${currentYear}-09-01`;
  }
  return `${currentYear + 1}-09-01`;
};

const getAll = async (psychologistId: string): Promise<(Patient &
  { appointmentsCount: string, appointmentsYearCount: string })[]> => {
  try {
    // Get all patients of psychologist
    const patients = await db.select('*')
        .from(patientsTable)
        .where('psychologistId', psychologistId)
        .andWhere('deleted', false);

    // Count the appointments taking in acount each patients sharing the same INE
    const patientsDataPromises = patients.map(async (patient) => {
      const appointmentsCountQuery = db.countDistinct('id')
          .from(appointmentsTable)
          .whereIn('patientId', function () {
            this.select('id')
              .from(patientsTable)
              .where(function () {
                if (patient.INE && patient.INE.trim() !== '') {
                  this.where('INE', patient.INE);
                } else {
                  this.where('id', patient.id);
                }
              })
              .andWhere('deleted', false);
          })
          .andWhere('deleted', false);

      const appointmentsYearCountQuery = db.countDistinct('id')
          .from(appointmentsTable)
          .whereIn('patientId', function () {
            this.select('id')
              .from(patientsTable)
              .where(function () {
                if (patient.INE && patient.INE.trim() !== '') {
                  this.where('INE', patient.INE);
                } else {
                  this.where('id', patient.id);
                }
              })
              .andWhere('deleted', false)
              .andWhereRaw(`"appointmentDate" > '${startCurrentUnivYear()}'`)
              .andWhereRaw(`"appointmentDate" < '${endCurrentUnivYear()}'`);
          })
          .andWhere('deleted', false);

      const [appointmentsCountResult, appointmentsYearCountResult] = await Promise.all([
        appointmentsCountQuery.first(),
        appointmentsYearCountQuery.first(),
      ]);

      return {
        ...patient,
        appointmentsCount: appointmentsCountResult ? appointmentsCountResult.count : '0',
        appointmentsYearCount: appointmentsYearCountResult ? appointmentsYearCountResult.count : '0',
      };
    });

    const patientsData = await Promise.all(patientsDataPromises);

    return patientsData;
  } catch (err) {
    console.error('Impossible de récupérer les patients', err);
    throw new Error('Impossible de récupérer les patients');
  }
};

const insert = async (
  firstNames: string,
  lastName: string,
  INE?: string,
  institutionName?: string,
  isStudentStatusVerified?: boolean,
  hasPrescription?: boolean,
  psychologistId?: string,
  doctorName?: string,
  doctorAddress?: string,
  doctorEmail?: string,
  dateOfBirth?: Date,
  dateOfPrescription?: Date,
): Promise<Patient> => {
  try {
    const patientsArray = await db(patientsTable).insert({
      firstNames,
      lastName,
      INE,
      institutionName,
      isStudentStatusVerified,
      hasPrescription,
      psychologistId,
      doctorName,
      doctorAddress,
      doctorEmail,
      dateOfBirth,
      dateOfPrescription,
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
  INE: string,
  institutionName: string,
  isStudentStatusVerified: boolean,
  hasPrescription: boolean,
  psychologistId: string,
  doctorName: string,
  doctorAddress: string,
  doctorEmail: string,
  dateOfBirth: Date,
  dateOfPrescription: Date,
): Promise<number> => {
  try {
    return await db(patientsTable)
      .where('id', id)
      .where('psychologistId', psychologistId)
      .update({
        firstNames,
        lastName,
        INE,
        institutionName,
        isStudentStatusVerified,
        hasPrescription,
        psychologistId,
        doctorName,
        doctorAddress,
        doctorEmail,
        dateOfBirth,
        dateOfPrescription,
        updatedAt: date.now(),
      });
  } catch (err) {
    console.error('Erreur de modification du patient', err);
    throw new Error('Erreur de modification du patient');
  }
};

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

export default {
  getById,
  getAll,
  insert,
  update,
  delete: deleteOne,
};
