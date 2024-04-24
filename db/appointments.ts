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

const compareAppointments = (a, b): number => {
  // Comparer les INE
  if (a.INE < b.INE) return -1;
  if (a.INE > b.INE) return 1;

  // Si les INE sont les mêmes, comparer les dates de rendez-vous
  if (a.appointmentDate < b.appointmentDate) return -1;
  if (a.appointmentDate > b.appointmentDate) return 1;

  return 0;
};

const getRelatedINEAppointments = async (
  appointments: AppointmentWithPatient[],
  period?: { startDate: Date, endDate: Date },
): Promise<AppointmentWithPatient[]> => {
  try {
    const INEList = appointments.reduce((acc, appointment) => {
      if (appointment.INE.trim() !== '') {
        acc.push(appointment.INE);
      }
      return acc;
    }, []);

    const existingAppointmentIds = new Set(appointments.map((appointment) => appointment.id));

    let query = db.from(patientsTable)
      .innerJoin(appointmentsTable, `${patientsTable}.id`, `${appointmentsTable}.patientId`)
      .whereIn(`${patientsTable}.INE`, INEList)
      .whereNot(`${appointmentsTable}.deleted`, true)
      .whereNotIn(`${appointmentsTable}.id`, Array.from(existingAppointmentIds));

    // Ajout de la condition relative à la période si period est défini
    if (period) {
      query = query.whereRaw(
        `${appointmentsTable}."appointmentDate" BETWEEN ? AND ?`,
        [period.startDate, period.endDate],
      );
    }

    const relatedAppointments = await query;

    appointments.push(...relatedAppointments);
    appointments.sort(compareAppointments);

    return appointments;
  } catch (err) {
    console.error('Impossible de récupérer les rendez-vous avec les patients', err);
    throw new Error('Impossible de récupérer les rendez-vous avec les patients');
  }
};

const getAll = async (
  psychologistId: string,
  period?: { startDate: Date, endDate: Date },
  orderBy: OrderByColumn[] = [],
): Promise<AppointmentWithPatient[]> => {
  try {
    const query = db.from(patientsTable)
    .innerJoin(appointmentsTable, `${patientsTable}.id`, `${appointmentsTable}.patientId`)
    .where(`${appointmentsTable}.psychologistId`, psychologistId)
    .whereNot(`${appointmentsTable}.deleted`, true);

    if (period) {
      query.whereRaw(
        `${appointmentsTable}."appointmentDate" BETWEEN ? AND ?`,
        [period.startDate, period.endDate],
      );
    }

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

    orderBy.forEach((order) => {
      query.orderBy(order.column, order.order || 'asc');
    });

    const appointments = await query;

    return appointments;
  } catch (err) {
    console.error('Impossible de récupérer les rendez-vous avec les patients', err);
    throw new Error('Impossible de récupérer les rendez-vous avec les patients');
  }
};

const getByPatientId = async (
  patientId: string,
  relatedINEAppointments = false,
  orderBy: OrderByColumn[] = [],
):
Promise<AppointmentWithPatient[]> => {
  try {
    const query = db.from(patientsTable)
      .leftJoin(appointmentsTable, `${patientsTable}.id`, `${appointmentsTable}.patientId`)
      .whereNot(`${appointmentsTable}.deleted`, true);

    if (relatedINEAppointments) {
      query.where(function () {
        this.where(`${appointmentsTable}.patientId`, patientId)
          .orWhere(`${patientsTable}.INE`, function () {
            this.select('INE')
              .from(patientsTable)
              .where('id', patientId);
          });
      });
    } else {
      query.where(`${appointmentsTable}.patientId`, patientId);
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
  getRelatedINEAppointments,
  getAll,
  getByPatientId,
  insert,
  delete: deleteOne,
};
