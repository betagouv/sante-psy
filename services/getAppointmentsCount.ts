/* eslint-disable no-nested-ternary */
import date from '../utils/date';
import { appointmentsTable, patientsTable } from '../db/tables';
import db from '../db/db';
import { endCurrentUnivYear, startCurrentUnivYear } from '../utils/univYears';
import { EnrichedPatient } from '../types/Patient';
import { AppointmentWithPatient } from '../types/Appointment';

type AppointmentRow = {
  id: string;
  appointmentDate: string;
  key: string;
};

const groupBy = (rows: AppointmentRow[]): Record<string, AppointmentRow[]> =>
  rows.reduce(
    (acc, row) => {
      (acc[row.key] ??= []).push(row);
      return acc;
    },
    {} as Record<string, AppointmentRow[]>,
  );
const fetchAppointmentsByField = (
  field: 'p.student_id' | 'p.INE' | 'a.patientId',
  values: (string | number)[],
): Promise<AppointmentRow[]> =>
  values.length
    ? db(`${appointmentsTable} as a`)
        .select('a.id', 'a.appointmentDate', `${field} as key`)
        .join(`${patientsTable} as p`, 'a.patientId', 'p.id')
        .whereIn(field, values)
        .andWhere('a.deleted', false)
        .andWhere('p.deleted', false)
    : Promise.resolve([]);

const buildBucket = async (
  field: 'p.student_id' | 'p.INE' | 'a.patientId',
  values: (string | number)[],
): Promise<Record<string, AppointmentRow[]>> => {
  const rows = await fetchAppointmentsByField(field, values);
  return groupBy(rows);
};

const getAppointmentsCount = async (
  patients: EnrichedPatient[] | AppointmentWithPatient[],
): Promise<EnrichedPatient[] | AppointmentWithPatient[]> => {
  const withStudentId = patients.filter((p) => p.student_id);
  const withIne = patients.filter((p) => !p.student_id && p.INE.trim() !== '');
  const withPatientIdOnly = patients.filter(
    (p) => !p.student_id && !(p.INE.trim() !== ''),
  );

  const studentIds = withStudentId.map((p) => p.student_id);
  const ines = withIne.map((p) => p.INE);
  const patientIds = withPatientIdOnly.map((p) => p.id);

  const [studentIdMap, ineMap, patientIdMap] = await Promise.all([
    buildBucket('p.student_id', studentIds),
    buildBucket('p.INE', ines),
    buildBucket('a.patientId', patientIds),
  ]);

  const START_NEW_RULES = new Date('2024-07-01T00:00:00Z');
  const START_UNIV_YEAR = new Date(startCurrentUnivYear());
  const END_UNIV_YEAR = new Date(endCurrentUnivYear());
  const MAX_APPOINTMENT_OLD = 8;

  return patients.map((patient) => {
    const appointmentsData = patient.student_id
      ? (studentIdMap[patient.student_id] ?? [])
      : patient.INE?.trim() !== ''
        ? (ineMap[patient.INE] ?? [])
        : (patientIdMap[patient.id] ?? []);

    let countedAppointments = 0;
    let countOldRules = 0;

    const appointmentsDataCurrentUnivYear = appointmentsData.filter(
      (appointment) => {
        const appointmentDate = date.getUTCDate(
          new Date(appointment.appointmentDate),
        );
        if (
          appointmentDate >= START_UNIV_YEAR &&
          appointmentDate <= END_UNIV_YEAR
        ) {
          if (appointmentDate < START_NEW_RULES) {
            countOldRules++;
            if (countOldRules <= MAX_APPOINTMENT_OLD) countedAppointments++;
          } else {
            countedAppointments++;
          }
          return true;
        }
        return false;
      },
    );

    return {
      ...patient,
      appointmentsCount: appointmentsData.length.toString(),
      appointmentsYearCount: appointmentsDataCurrentUnivYear.length.toString(),
      countedAppointments: countedAppointments.toString(),
    };
  });
};

export default getAppointmentsCount;
