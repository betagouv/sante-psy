import { Appointment, AppointmentWithPatient } from '../types/Appointment';
import date from '../utils/date';
import {
  appointmentsTable, patientsTable, psychologistsTable, universitiesTable,
} from './tables';
import db from './db';

const getAll = async (psychologistId: string): Promise<AppointmentWithPatient[]> => {
  try {
    const appointmentArray = await db.from(patientsTable)
    .innerJoin(appointmentsTable, `${patientsTable}.id`, `${appointmentsTable}.patientId`)
    .where(`${appointmentsTable}.psychologistId`, psychologistId)
    .whereNot(`${appointmentsTable}.deleted`, true)
    .orderBy('appointmentDate', 'desc');
    return appointmentArray;
  } catch (err) {
    console.error('Impossible de récupérer les appointments', err);
    throw new Error('Impossible de récupérer les appointments');
  }
};

const getLastWeekByUniversity = async (): Promise<{name: string, count: string}[]> => {
  try {
    const now = new Date();
    const lastWeek = new Date();
    now.setHours(18, 0, 0, 0);
    lastWeek.setHours(18, 0, 0, 0);
    lastWeek.setDate(now.getDate() - 7);

    const appointments = await db
    .select(`${universitiesTable}.name`)
    .from(appointmentsTable)
    .innerJoin(psychologistsTable, `${appointmentsTable}.psychologistId`, `${psychologistsTable}.dossierNumber`)
    .innerJoin(universitiesTable, `${psychologistsTable}.assignedUniversityId`, `${universitiesTable}.id`)
    .where(`${appointmentsTable}.appointmentDate`, '>=', lastWeek.toISOString())
    .where(`${appointmentsTable}.appointmentDate`, '<', now.toISOString())
    .count('*')
    .groupBy(`${universitiesTable}.name`)
    .orderBy(`${universitiesTable}.name`);

    return appointments;
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

    console.log('deleted', deletedAppointments);
    return deletedAppointments;
  } catch (err) {
    console.error('Erreur de suppression du appointments', err);
    throw new Error('Erreur de suppression du appointments');
  }
};

export default {
  getAll,
  insert,
  delete: deleteOne,
  getLastWeekByUniversity,
};
