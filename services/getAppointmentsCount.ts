import date from '../utils/date';
import { appointmentsTable, patientsTable } from '../db/tables';
import db from '../db/db';
import { endCurrentUnivYear, startCurrentUnivYear } from '../utils/univYears';
import { Patient } from '../types/Patient';
import { AppointmentWithPatient } from '../types/Appointment';

const getAppointmentsCount = async (patients: Patient[] | AppointmentWithPatient[])
: Promise<Patient[] | AppointmentWithPatient[]> => {
  const promiseData = patients.map(async (patient) => {
    const appointmentsData = await db.select('id', 'appointmentDate')
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

    const START_NEW_RULES = new Date('2024-06-15T00:00:00Z');
    const MAX_APPOINTMENT_OLD = 8;
    let countedAppointments = 0;
    let countOldRules = 0;

    const appointmentsDataCurrentUnivYear = appointmentsData.filter((appointment) => {
      const startUnivYear = date.getUTCDate(new Date(startCurrentUnivYear()));
      const endUnivYear = date.getUTCDate(new Date(endCurrentUnivYear()));
      const appointmentDate = date.getUTCDate(new Date(appointment.appointmentDate));

      // NEW RULE UPDATE: newRuleCount doesn't count exceeded appointment when max was 8.
      if (appointmentDate >= startUnivYear && appointmentDate <= endUnivYear) {
        if (appointmentDate < START_NEW_RULES) {
          countOldRules++;
          if (countOldRules <= MAX_APPOINTMENT_OLD) {
            countedAppointments++;
          }
        } else {
          countedAppointments++;
        }
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
      countedAppointments: countedAppointments.toString(),
    };
  });
  const result: Patient[] = await Promise.all(promiseData);
  return result;
};

export default getAppointmentsCount;
