import { Appointment } from '../types/Appointment';
import date from '../utils/date';
import { appointmentsTable, patientsTable, psychologistsTable } from './tables';
import db from './db';

// todo: bug : if appointment has a patientId that does not match a patient object in the db,
// this function returns empty.
const getAll = async (psychologistId: string): Promise<any[]> => {
  try {
    const appointmentArray = await db.from(patientsTable)
      .innerJoin(`${appointmentsTable}`, `${patientsTable}.id`, `${appointmentsTable}.patientId`)
      .where(`${appointmentsTable}.psychologistId`, psychologistId)
      .whereNot(`${appointmentsTable}.deleted`, true)
      .orderBy('appointmentDate', 'desc');
    return appointmentArray;
  } catch (err) {
    console.error('Impossible de récupérer les appointments', err);
    throw new Error('Impossible de récupérer les appointments');
  }
};

/**
 * Note : january = 1, february = 2, etc
 * Example output :
 * [
 *  {countAppointments: 3, year: 2021, month: 3, psychologistId: '112323232-33434-3434'},
 *  {countAppointments: 2, year: 2021, month: 4, psychologistId: '112323232-33434-3434'},
 * ]
 */
const getCountByYearMonth = async (psychologistId: string): Promise<any[]> => {
  try {
    const query = await db(appointmentsTable)
      .select(db.raw(`CAST(COUNT(*) AS INTEGER) AS "countAppointments"
        , "psychologistId"
        , EXTRACT(YEAR from "appointmentDate") AS year
        , EXTRACT(MONTH from "appointmentDate") AS month`))
      .where('psychologistId', psychologistId)
      .whereNot(`${appointmentsTable}.deleted`, true)
      .groupByRaw(`"psychologistId"
        , EXTRACT(YEAR from "appointmentDate")
        , EXTRACT(MONTH from "appointmentDate")`)
      .orderBy([{ column: 'year', order: 'asc' }, { column: 'month', order: 'asc' }]);

    return query;
  } catch (err) {
    console.error('Impossible de récupérer les appointments', err);
    throw new Error('Impossible de récupérer les appointments');
  }
};

/**
 * Output the number of appointments for each psy, for the given month and year. Join with university id.
 *
 * Note : january = 1, february = 2, etc
 * Example output :
 * [
 *  {
 *    countAppointments: 3, psychologistId: '112323232-33434-3434', universityId: '15555523232-33434-3434,
 *    firstNames: "firsname1", lastName: "name", personallEmail: "test@email.com"
 *  },
 *  {
 *    countAppointments: 2, psychologistId: '343423232-33434-1111', universityId: '23232555551-33434-3434,
 *    firstNames: "Stevie", lastName: "Wonder", personallEmail: "personnal@email.com"
 *  },
 * ]
 */
const getMonthlySummary = async (year: string, month: string): Promise<any[]> => {
  try {
    const query = await db(appointmentsTable)
      .select(db.raw(`CAST(COUNT(*) AS INTEGER) AS "countAppointments"
        , ${appointmentsTable}."psychologistId"
        , ${psychologistsTable}."assignedUniversityId" AS "universityId"
        , ${psychologistsTable}."firstNames"
        , ${psychologistsTable}."lastName"
        , ${psychologistsTable}."personalEmail"
        `))
        .whereRaw(`EXTRACT(YEAR from ${appointmentsTable}."appointmentDate") = ${year}`)
        .andWhereRaw(`EXTRACT(MONTH from ${appointmentsTable}."appointmentDate") = ${month}`)
        .whereNot(`${appointmentsTable}.deleted`, true)
        .innerJoin(`${psychologistsTable}`,
          `${appointmentsTable}.psychologistId`,
          `${psychologistsTable}.dossierNumber`)
      .groupBy(`${appointmentsTable}.psychologistId`)
      .groupBy(`${psychologistsTable}.assignedUniversityId`)
      .groupBy(`${psychologistsTable}.firstNames`)
      .groupBy(`${psychologistsTable}.lastName`)
      .groupBy(`${psychologistsTable}.personalEmail`)
      .orderBy('countAppointments');

    return query;
  } catch (err) {
    console.error('Impossible de récupérer les appointments', err);
    throw new Error('Impossible de récupérer les appointments');
  }
};

/**
 * Note : january = 1, february = 2, etc
 * Example output :
 * [
 *  {countPatients: 3, year: 2021, month: 3},
 *  {countPatients: 2, year: 2021, month: 4},
 * ]
 */
const getCountPatientsByYearMonth = async (psychologistId: string): Promise<any[]> => {
  try {
    const query = await db(appointmentsTable)
      .select(db.raw(`CAST(COUNT(DISTINCT "patientId") AS INTEGER) AS "countPatients"
        , EXTRACT(YEAR from "appointmentDate") AS year
        , EXTRACT(MONTH from "appointmentDate") AS month`))
      .where('psychologistId', psychologistId)
      .whereNot(`${appointmentsTable}.deleted`, true)
      .groupByRaw(`EXTRACT(YEAR from "appointmentDate")
        , EXTRACT(MONTH from "appointmentDate")`)
      .orderBy([{ column: 'year', order: 'asc' }, { column: 'month', order: 'asc' }]);
    return query;
  } catch (err) {
    console.error('Impossible de récupérer les appointments', err);
    throw new Error('Impossible de récupérer les appointments');
  }
};

const insert = async (appointmentDate: Date, patientId: string, psychologistId: string): Promise<Appointment> => {
  try {
    const insertedArray = await db(appointmentsTable).insert({
      psychologistId,
      appointmentDate,
      patientId,
    }).returning('*');
    return insertedArray[0];
  } catch (err) {
    console.error('Erreur de sauvegarde du appointments', err);
    throw new Error('Erreur de sauvegarde du appointments');
  }
};

const deleteOne = async (appointmentId: string, psychologistId: string): Promise<number> => {
  try {
    const deletedAppointments = await db(appointmentsTable)
      .where({
        id: appointmentId,
        deleted: false,
        psychologistId,
      })
      .update({
        deleted: true,
        updatedAt: date.now(),
      });

    console.log(`Appointment id ${appointmentId} deleted by psy id ${psychologistId}`);

    return deletedAppointments;
  } catch (err) {
    console.error('Erreur de suppression du appointments', err);
    throw new Error('Erreur de suppression du appointments');
  }
};

export default {
  getAll,
  getCountByYearMonth,
  getMonthlySummary,
  getCountPatientsByYearMonth,
  insert,
  delete: deleteOne,
};
