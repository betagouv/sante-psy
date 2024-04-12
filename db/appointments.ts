// eslint-disable-next-line import/no-unresolved
import { Registry } from 'knex/types/result';
import { Appointment, AppointmentWithPatient } from '../types/Appointment';
import date from '../utils/date';
import { appointmentsTable, patientsTable } from './tables';
import db from './db';

type OrderByColumn = {
  column: string;
  order?: 'asc' | 'desc';
};

const getAll = async (
  period?: { startDate: Date, endDate: Date },
  orderBy: OrderByColumn[] = [],
):
Promise<AppointmentWithPatient[]> => {
  try {
    const query = db.from(patientsTable)
      .innerJoin(appointmentsTable, `${patientsTable}.id`, `${appointmentsTable}.patientId`)
      .whereNot(`${appointmentsTable}.deleted`, true);

    // Get from specific period
    if (period) {
      query.whereRaw(
        `${appointmentsTable}."appointmentDate" BETWEEN ? AND ?`,
        [period.startDate, period.endDate],
      );
    }

    // Add univYear to results
    query.select(
      db.raw(`
        CASE 
            WHEN EXTRACT(MONTH FROM ${appointmentsTable}."appointmentDate") < 9 
            THEN CONCAT(EXTRACT(YEAR FROM ${appointmentsTable}."appointmentDate") - 1, 
            '-', EXTRACT(YEAR FROM ${appointmentsTable}."appointmentDate"))
            ELSE CONCAT(EXTRACT(YEAR FROM ${appointmentsTable}."appointmentDate"), 
            '-', EXTRACT(YEAR FROM ${appointmentsTable}."appointmentDate") + 1)
        END AS "univYear",
        ${patientsTable}.*,
        ${appointmentsTable}.*
      `),
    );

    // Order
    orderBy.forEach((order) => {
      query.orderBy(order.column, order.order || 'asc');
    });

    const appointmentArray = await query;

    return appointmentArray;
  } catch (err) {
    console.error('Impossible de récupérer les appointments', err);
    throw new Error('Impossible de récupérer les appointments');
  }
};

const getByPatientId = async (
  patientId: string,
  orderBy: OrderByColumn[] = [],
):
Promise<AppointmentWithPatient[]> => {
  try {
    const query = db.from(patientsTable)
      .leftJoin(appointmentsTable, `${patientsTable}.id`, `${appointmentsTable}.patientId`)
      .where(`${appointmentsTable}.patientId`, patientId)
      .whereNot(`${appointmentsTable}.deleted`, true);

    // Add univYear to results
    query.select(
      db.raw(`
        CASE 
            WHEN EXTRACT(MONTH FROM ${appointmentsTable}."appointmentDate") < 9 
            THEN CONCAT(EXTRACT(YEAR FROM ${appointmentsTable}."appointmentDate") - 1, 
            '-', EXTRACT(YEAR FROM ${appointmentsTable}."appointmentDate"))
            ELSE CONCAT(EXTRACT(YEAR FROM ${appointmentsTable}."appointmentDate"), 
            '-', EXTRACT(YEAR FROM ${appointmentsTable}."appointmentDate") + 1)
        END AS "univYear",
        ${patientsTable}.*,
        ${appointmentsTable}.*
      `),
    );

    // Order
    orderBy.forEach((order) => {
      query.orderBy(order.column, order.order || 'asc');
    });

    const appointmentArray = await query;
    return appointmentArray;
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

const countByPatient = async (patientId: string): Promise<Registry[]> => {
  try {
    return db(appointmentsTable)
    .where({ deleted: false, patientId })
    .countDistinct('id');
  } catch (err) {
    console.error('Impossible de récupérer les appointments', err);
    throw new Error('Impossible de récupérer les appointments');
  }
};

export default {
  countByPatient,
  getAll,
  getByPatientId,
  insert,
  delete: deleteOne,
};
