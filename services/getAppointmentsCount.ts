import date from '../utils/date';
import { appointmentsTable, patientsTable } from '../db/tables';
import db from '../db/db';
import { endCurrentUnivYear, startCurrentUnivYear } from '../utils/univYears';
import { Patient } from '../types/Patient';
import { AppointmentWithPatient } from '../types/Appointment';

const getAppointmentsCount = async (patients: Patient[] | AppointmentWithPatient[])
: Promise<Patient[] | AppointmentWithPatient[]> => (
  Promise.all(patients.map(async (patient) => {
    const isValidINE = patient.INE?.trim() !== '';

    const patientFilter = isValidINE
      ? { 'p.INE': patient.INE }
      : { 'a.patientId': patient.id };

    const appointmentsData = await db(`${appointmentsTable} as a`)
      .select('a.id', 'a.appointmentDate')
      .join(`${patientsTable} as p`, 'a.patientId', 'p.id')
      .where(patientFilter)
      .andWhere('a.deleted', false)
      .andWhere('p.deleted', false);

    const START_NEW_RULES = new Date('2024-07-01T00:00:00Z');
    const START_UNIV_YEAR = new Date(startCurrentUnivYear());
    const END_UNIV_YEAR = new Date(endCurrentUnivYear());
    const MAX_APPOINTMENT_OLD = 8;
    let countedAppointments = 0;
    let countOldRules = 0;

    const appointmentsDataCurrentUnivYear = appointmentsData.filter((appointment) => {
      const appointmentDate = date.getUTCDate(new Date(appointment.appointmentDate));

      if (appointmentDate >= START_UNIV_YEAR && appointmentDate <= END_UNIV_YEAR) {
        /* New rule - doesn't count exceeded appointment when max was 8 */
        if (appointmentDate < START_NEW_RULES) {
          countOldRules++;
          if (countOldRules <= MAX_APPOINTMENT_OLD) {
            countedAppointments++;
          }
        } else {
          countedAppointments++;
        }
        /* End new rule */

        return true;
      }
      return false;
    });

    const appointmentsCountResult = appointmentsData
      ? appointmentsData.length.toString() : '0';
    const appointmentsYearCountResult = appointmentsDataCurrentUnivYear
      ? appointmentsDataCurrentUnivYear.length.toString() : '0';

    return {
      ...patient,
      appointmentsCount: appointmentsCountResult,
      appointmentsYearCount: appointmentsYearCountResult,
      countedAppointments: countedAppointments.toString(), // New rule count
    };
  })));

export default getAppointmentsCount;
