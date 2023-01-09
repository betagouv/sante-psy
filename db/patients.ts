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

const getAll = async (psychologistId: string): Promise<(Patient & {appointmentsCount: string})[]> => {
  try {
    const patientArray = await db.select(`${patientsTable}.*`)
        .from(patientsTable)
        .joinRaw(`left join "${appointmentsTable}" on `
        + `"${patientsTable}"."id" = "${appointmentsTable}"."patientId" and "${appointmentsTable}"."deleted" = false`)
        .where(`${patientsTable}.psychologistId`, psychologistId)
        .andWhere(`${patientsTable}.deleted`, false)
        .count(`${appointmentsTable}.*`, { as: 'appointmentsCount' })
        .groupBy(`${patientsTable}.id`)
        .orderByRaw(`LOWER("${patientsTable}"."lastName"), LOWER("${patientsTable}"."firstNames")`);
    return patientArray;
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
  dateOfBirth?: Date,
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
      dateOfBirth,
    }).returning('*');
    return patientsArray[0];
  } catch (err) {
    console.error('Erreur de sauvegarde du patient', err);
    throw new Error('Erreur de sauvegarde du patient');
  }
};

const renew = async (id: string, psychologistId: string): Promise<number> => {
  try {
    return await db(patientsTable)
    .where('id', id)
    .where('psychologistId', psychologistId)
    .update({ renewed: true });
  } catch (err) {
    console.error('Erreur de modification du patient', err);
    throw new Error('Erreur de modification du patient');
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
  dateOfBirth: Date,
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
        dateOfBirth,
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
  renew,
};
