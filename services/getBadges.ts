import { AppointmentWithPatient } from '../types/Appointment';
import dateUtils from '../utils/date';
import appointmentBadges from '../utils/badges';
import { Patient } from '../types/Patient';

const arePrescriptionInfosFilled = (appointment: AppointmentWithPatient | Patient) : boolean => {
  const {
    doctorAddress, doctorName, dateOfPrescription, hasPrescription,
  } = appointment;
  return !!doctorAddress && !!doctorName && !!dateOfPrescription && !!hasPrescription;
};

const areStudentInfosFilled = (appointment: AppointmentWithPatient | Patient) : boolean => {
  const {
    firstNames, lastName, dateOfBirth, institutionName, INE,
  } = appointment;
  return !!firstNames && !!lastName && !!dateOfBirth && !!institutionName && !!INE;
};

const getPatientBadges = (patient: AppointmentWithPatient | Patient): string[] => {
  const MAX_APPOINTMENT = 8;
  const appointmentsYearCount = parseInt(patient.appointmentsYearCount);
  const badges = [];

  if (!areStudentInfosFilled(patient)) {
    badges.push(appointmentBadges.student_infos);
  }
  if (!arePrescriptionInfosFilled(patient)) {
    badges.push(appointmentBadges.prescription_infos);
  }
  if (appointmentsYearCount === MAX_APPOINTMENT) {
    badges.push(appointmentBadges.max);
  } else if (appointmentsYearCount > MAX_APPOINTMENT) {
    badges.push(appointmentBadges.exceeded);
  } else if (appointmentsYearCount === MAX_APPOINTMENT - 1) {
    badges.push(appointmentBadges.before_max);
  }

  if (badges.length === 0) {
    badges.push(appointmentBadges.completed);
  }
  return badges;
};

const getPatientWithBadges = (
  patients: Patient[],
): Patient[] => {
  const patientsWithBadges = [];
  patients.forEach((patient) => {
    const badges = getPatientBadges(patient);

    patientsWithBadges.push({
      ...patient,
      badges,
    });
  });
  return patientsWithBadges;
};

const getAppointmentWithBadges = (
  appointments: AppointmentWithPatient[],
  isBillingPurposes: boolean,
  period?: { month: number, year: number },
  psychologistId?: string,
)
: AppointmentWithPatient[] => {
  const START_CYCLE_DATE = new Date('2023-09-01T00:00:00Z');
  const START_FIRST_DATE = new Date('2024-01-01T00:00:00Z');
  const appointmentsWithBadges = [];
  const appointmentsCountByPatient = {};

  appointments.forEach((appointment) => {
    const appointmentDate = dateUtils.getUTCDate(new Date(appointment.appointmentDate));
    const cycle = dateUtils.getUnivYear(appointmentDate); // TODO: see if we can use appointment.univYear
    const currentmonth = appointmentDate.getMonth() + 1;
    const isInPeriod = period ? currentmonth === period.month : true;

    if (!appointmentsCountByPatient[cycle]) {
      appointmentsCountByPatient[cycle] = {};
    }

    if (!appointmentsCountByPatient[cycle][appointment.patientId]) {
      appointmentsCountByPatient[cycle][appointment.patientId] = 1;
    }

    // We don't need before_max and max badges on bill.
    const badges = [];

    const appointmentCount = appointmentsCountByPatient[cycle][appointment.patientId];

    if (isBillingPurposes) {
      if (appointmentCount === 1) {
        if (!(appointmentDate >= START_CYCLE_DATE && appointmentDate <= START_FIRST_DATE)) {
          badges.push(appointmentBadges.first);
        }
      } else if (appointmentCount > 8) {
        badges.push(appointmentBadges.exceeded);
      }
    } else {
      if (psychologistId && appointment.psychologistId !== psychologistId) {
        badges.push(appointmentBadges.other_psychologist);
      }
      if (appointmentCount === 1) {
        badges.push(appointmentBadges.first);
      } else if (appointmentCount === 7) {
        badges.push(appointmentBadges.before_max);
      } else if (appointmentCount === 8) {
        badges.push(appointmentBadges.max);
      } else if (appointmentCount > 8) {
        badges.push(appointmentBadges.exceeded);
      }
    }

    // Exclude exceeded appointments from bill and return selected month appointments only
    if ((!isBillingPurposes || (isBillingPurposes
      && !badges.includes(appointmentBadges.exceeded))) && isInPeriod) {
      appointmentsWithBadges.push({
        ...appointment,
        badges,
      });
    }

    appointmentsCountByPatient[cycle][appointment.patientId]++;
  });

  const orderedAppointmentsWithBadges = appointmentsWithBadges.sort(
    (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime(),
  );

  return orderedAppointmentsWithBadges;
};

export {
  getAppointmentWithBadges,
  getPatientWithBadges,
};
