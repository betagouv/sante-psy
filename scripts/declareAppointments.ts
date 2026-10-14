/* eslint-disable max-len */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import db from '../db/db';
import { patientsTable } from '../db/tables';
import dbAppointments from '../db/appointments';

interface AppointmentEntry {
  patientId: string;
  dateStr: string;
}

function parseDates(input: string): string[] {
  return input
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => {
      const [day, month, year] = s.split('/');
      return `20${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    });
}

const workAppointmentEntry = async (
  appointmentEntry: AppointmentEntry,
): Promise<void> => {
  const patient = await db(patientsTable)
    .where('id', appointmentEntry.patientId)
    .andWhere('deleted', false)
    .first();

  if (!patient) {
    console.log(`-- patient ${appointmentEntry.patientId} not found`);
    return;
  }

  const dates = parseDates(appointmentEntry.dateStr);

  for (const date of dates) {
    console.log(
      `-- insert appointment ${date} - ${appointmentEntry.patientId} - ${patient.psychologistId}`,
    );
    dbAppointments.insert(
      new Date(date),
      appointmentEntry.patientId,
      patient.psychologistId,
    );
  }
};

const declareAppointments = async (
  appointmentEntries: AppointmentEntry[],
): Promise<void> => {
  console.log(`- insert ${appointmentEntries.length} appointment entries`);
  for (const appointmentEntry of appointmentEntries) {
    await workAppointmentEntry(appointmentEntry);
  }
};

// format
// { patientId: 'f78450f1-d8e2-4cc9-b917-xxx', dateStr: '31/08/26' },
const appointmentEntries = [] as AppointmentEntry[];

declareAppointments(appointmentEntries).catch((err) => {
  console.error('Fatal error while declaring appointments:', err);
  process.exit(1);
});
