import { AppointmentWithPatient, AppointmentInfo } from '../types/Appointment';
import dateUtils from '../utils/date';
import appointmentBadges from '../utils/badges';
import { Patient } from '../types/Patient';

const arePrescriptionInfosFilled = (appointment: AppointmentWithPatient | Patient) : boolean => {
  const {
    doctorAddress, doctorName, hasPrescription,
  } = appointment;
  return !!doctorAddress && !!doctorName && !!hasPrescription;
};

const areStudentINEFilled = (appointment: AppointmentWithPatient | Patient) : boolean => {
  const {
    INE,
  } = appointment;
  return !!INE;
};

const addBadges = (count: number, max: number, countFirsts = true): string[] => {
  const badges = [];

  if (countFirsts && count === 1) {
    badges.push(appointmentBadges.first);
  } else if (count === (max - 1)) {
    badges.push(appointmentBadges.before_max);
  } else if (count === max) {
    badges.push(appointmentBadges.max);
  } else if (count > max) {
    badges.push(appointmentBadges.exceeded);
  }

  return badges;
};

const getPatientBadges = (patient: AppointmentWithPatient | Patient): string[] => {
  const MAX_APPOINTMENT = 8;
  const appointmentsYearCount = parseInt(patient.appointmentsYearCount);
  const badges = [];

  if (!areStudentINEFilled(patient)) {
    badges.push(appointmentBadges.student_ine);
  }
  if (!arePrescriptionInfosFilled(patient)) {
    badges.push(appointmentBadges.prescription_infos);
  }

  const badgesToAdd = addBadges(appointmentsYearCount, MAX_APPOINTMENT, false);
  badges.concat(badgesToAdd);

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

const containBadges = (badges: string[], badgesToCheck: string[])
: boolean => badgesToCheck.some((string) => badges.includes(string));

const getAppointmentWithBadges = (
  appointments: AppointmentWithPatient[],
  isBillingPurposes: boolean,
  period?: { month: number, year: number },
  psychologistId?: string,
  patientWithCount?: Patient,
)
: AppointmentWithPatient[] => {
  const START_CYCLE_DATE = new Date('2023-09-01T00:00:00Z');
  const START_FIRST_DATE = new Date('2024-01-01T00:00:00Z');
  const START_NEW_RULES = new Date('2024-06-15T00:00:00Z');
  const appointmentsWithBadges = [];
  const appointmentsCountByPatient = {};

  appointments.forEach((appointment, i) => {
    const appointmentDate = dateUtils.getUTCDate(new Date(appointment.appointmentDate));
    const cycle = dateUtils.getUnivYear(appointmentDate); // TODO: see if we can use appointment.univYear
    const currentmonth = appointmentDate.getMonth() + 1;
    const isInPeriod = period ? currentmonth === period.month : true;
    const curatedPatient = appointment.INE ? appointment.INE : appointment.patientId;
    const applyNewRules = appointmentDate >= START_NEW_RULES;
    const MAX_APPOINTMENT_OLD = 8;
    const MAX_APPOINTMENT_NEW = 12;
    const MAX_APPOINTMENT = applyNewRules ? MAX_APPOINTMENT_NEW : MAX_APPOINTMENT_OLD;
    const warningBadges = [appointmentBadges.exceeded, appointmentBadges.before_max, appointmentBadges.max];

    appointmentsCountByPatient[cycle] = appointmentsCountByPatient[cycle] || {};
    appointmentsCountByPatient[cycle][curatedPatient] = appointmentsCountByPatient[cycle][curatedPatient] || [];

    const previousAppointment = appointmentsCountByPatient[cycle][curatedPatient][
      appointmentsCountByPatient[cycle][curatedPatient].length - 1
    ];

    const appointmentInfo: AppointmentInfo = {
      badges: [],
      date: appointmentDate,
      count: previousAppointment ? previousAppointment.count + 1 : 1,
    };

    // Get previous appointment info.
    let previousAppointmentChangeRule = false;
    let previousIsSameCycle = false;

    if (previousAppointment) {
      previousIsSameCycle = cycle === dateUtils.getUnivYear(previousAppointment.date);

      previousAppointmentChangeRule = applyNewRules
      && previousAppointment.date < START_NEW_RULES
      && previousIsSameCycle
      && containBadges(previousAppointment.badges, warningBadges);
    }

    // Reset count to 8 to skip exceeded appointments if rule changed
    if (previousAppointmentChangeRule) {
      appointmentInfo.count = MAX_APPOINTMENT_OLD + 1;
    }

    // Apply new rule with 12 max appointments instead of 8.
    if (applyNewRules && appointmentInfo.count <= MAX_APPOINTMENT) {
      appointmentInfo.badges.push(appointmentBadges.new_rules);
    }

    // Get next appointment info.
    const nextAppointment = appointments[i + 1];
    let nextAppointmentDate = null;
    let nextAppointmentChangeRule = false;
    let nextPatient = null;
    let nextIsSameCycle = false;

    if (nextAppointment) {
      nextAppointmentDate = dateUtils.getUTCDate(new Date(nextAppointment.appointmentDate));
      nextIsSameCycle = cycle === dateUtils.getUnivYear(nextAppointmentDate);
      nextPatient = nextAppointment.INE ? nextAppointment.INE : nextAppointment.patientId;

      nextAppointmentChangeRule = !applyNewRules
      && nextAppointmentDate >= START_NEW_RULES
      && nextIsSameCycle
      && curatedPatient === nextPatient;
    }

    // We don't need before_max and max badges on bill.
    if (isBillingPurposes) {
      if (appointmentInfo.count === 1 && !applyNewRules) {
        if (!(appointmentDate >= START_CYCLE_DATE && appointmentDate <= START_FIRST_DATE)) {
          appointmentInfo.badges.push(appointmentBadges.first);
        }
      } else if (appointmentInfo.count > MAX_APPOINTMENT) {
        appointmentInfo.badges.push(appointmentBadges.exceeded);
      }
    } else {
      if (psychologistId && appointment.psychologistId !== psychologistId) {
        appointmentInfo.badges.push(appointmentBadges.other_psychologist);
      }

      const badgesToAdd = addBadges(appointmentInfo.count, MAX_APPOINTMENT, !applyNewRules);
      appointmentInfo.badges = appointmentInfo.badges.concat(badgesToAdd);
    }

    // Apply inactive badges to old rule count when next appointment is after 15 june
    // Or Apply switch notice badge when last appointment was before 15 june with a warning badge
    if (nextAppointmentChangeRule) {
      if (containBadges(appointmentInfo.badges, warningBadges)) {
        appointmentInfo.badges.push(appointmentBadges.inactive);
        appointmentInfo.badges.push(appointmentBadges.switch_rule_notice);
      }

      appointmentsCountByPatient[cycle][curatedPatient].forEach((previous) => {
        if (previous.date >= START_CYCLE_DATE) {
          if (containBadges(previous.badges, warningBadges)) {
            previous.badges.push(appointmentBadges.inactive);
          }
        }
      });
    } else if ((!applyNewRules && appointmentDate > START_CYCLE_DATE)
      && (nextPatient !== curatedPatient || !nextIsSameCycle)
      && containBadges(appointmentInfo.badges, warningBadges)
    ) {
      appointmentInfo.badges.push(appointmentBadges.switch_rule_notice);
    }

    // Exclude exceeded appointments from bill and return selected month appointments only
    if ((!isBillingPurposes || (isBillingPurposes
      && !appointmentInfo.badges.includes(appointmentBadges.exceeded))) && isInPeriod) {
      const { badges } = appointmentInfo;
      appointmentsWithBadges.push({
        ...appointment,
        badges,
      });
    }
    appointmentsCountByPatient[cycle][curatedPatient].push(appointmentInfo);
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
