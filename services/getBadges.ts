import { AppointmentWithPatient, AppointmentInfo } from '../types/Appointment';
import dateUtils from '../utils/date';
import appointmentBadges from '../utils/badges';
import { getUnivYear } from '../utils/univYears';
import { Patient } from '../types/Patient';

const START_CYCLE_DATE = new Date('2023-09-01T00:00:00Z');
const START_FIRST_DATE = new Date('2024-01-01T00:00:00Z');
const START_NEW_RULES = new Date('2024-07-01T00:00:00Z');
const MAX_APPOINTMENT_OLD = 8;
const MAX_APPOINTMENT_NEW = 12;

const areStudentINEFilled = (appointment: AppointmentWithPatient | Patient): boolean => {
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
  const countedAppointments = parseInt(patient.countedAppointments);
  let badges = [];

  if (!areStudentINEFilled(patient)) {
    badges.push(appointmentBadges.student_ine);
  }

  const badgesToAdd = addBadges(countedAppointments, MAX_APPOINTMENT_NEW, false);
  badges = badges.concat(badgesToAdd);

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

const getMaxAppointmentCount = (date: Date): number => (
  date >= START_NEW_RULES ? MAX_APPOINTMENT_NEW : MAX_APPOINTMENT_OLD
);

const getCuratedPatient = (appointment: AppointmentWithPatient): string => appointment.INE || appointment.patientId;

const createAppointmentInfo = (
  previousAppointment: AppointmentInfo | undefined,
  appointmentDate: Date,
  applyNewRules: boolean,
): AppointmentInfo => {
  const appointmentInfo: AppointmentInfo = {
    badges: [],
    date: appointmentDate,
    count: previousAppointment ? previousAppointment.count + 1 : 1,
  };

  /* New rule */
  if (previousAppointment && applyNewRules && previousAppointment.date < START_NEW_RULES
    && containBadges(
      previousAppointment.badges,
      [appointmentBadges.exceeded, appointmentBadges.before_max, appointmentBadges.max],
    )
  ) {
    appointmentInfo.count = MAX_APPOINTMENT_OLD + 1;
  }
  /* End new rule */

  return appointmentInfo;
};

const processNextAppointment = (
  nextAppointment: AppointmentWithPatient | undefined,
  cycle: string,
  curatedPatient: string,
  applyNewRules: boolean,
  patientAppointments: AppointmentInfo[],
  appointmentInfo: AppointmentInfo,
  startCycleDate: Date,
  warningBadges: string[],
): void => {
  if (!nextAppointment) return;

  const nextAppointmentDate = dateUtils.getUTCDate(new Date(nextAppointment.appointmentDate));
  const nextIsSameCycle = cycle === getUnivYear(nextAppointmentDate);
  const nextPatient = nextAppointment.INE ? nextAppointment.INE : nextAppointment.patientId;
  const nextAppointmentChangeRule = !applyNewRules && nextAppointmentDate >= START_NEW_RULES
                                    && nextIsSameCycle && curatedPatient === nextPatient;

  if (nextAppointmentChangeRule && containBadges(appointmentInfo.badges, warningBadges)) {
    appointmentInfo.badges.push(appointmentBadges.inactive, appointmentBadges.switch_rule_notice);
    patientAppointments.forEach((previous) => {
      if (previous.date >= startCycleDate && containBadges(previous.badges, warningBadges)) {
        previous.badges.push(appointmentBadges.inactive);
      }
    });
  }
};

const addBillingBadges = (
  appointmentInfo: AppointmentInfo,
  appointmentDate: Date,
  applyNewRules: boolean,
  maxAppointment: number,
  startCycleDate: Date,
  startFirstDate: Date,
): void => {
  if (appointmentInfo.count === 1 && !applyNewRules
      && !(appointmentDate >= startCycleDate && appointmentDate <= startFirstDate)) {
    appointmentInfo.badges.push(appointmentBadges.first);
  } else if (appointmentInfo.count > maxAppointment) {
    appointmentInfo.badges.push(appointmentBadges.exceeded);
  }
};

const addNonBillingBadges = (
  appointmentInfo: AppointmentInfo,
  psychologistId: string | undefined,
  appointment: AppointmentWithPatient,
  maxAppointment: number,
  applyNewRules: boolean,
): void => {
  if (psychologistId && appointment.psychologistId !== psychologistId) {
    appointmentInfo.badges.push(appointmentBadges.other_psychologist);
  }
  appointmentInfo.badges.push(...addBadges(appointmentInfo.count, maxAppointment, !applyNewRules));
};

const getAppointmentWithBadges = (
  appointments: AppointmentWithPatient[],
  isBillingPurposes: boolean,
  period?: { month: number, year: number },
  psychologistId?: string,
): AppointmentWithPatient[] => {
  const warningBadges = [appointmentBadges.exceeded, appointmentBadges.before_max, appointmentBadges.max];
  const appointmentsWithBadges: AppointmentWithPatient[] = [];
  const appointmentsCountByPatient = new Map<string, Map<string, AppointmentInfo[]>>();

  appointments.forEach((appointment, i) => {
    const appointmentDate = dateUtils.getUTCDate(new Date(appointment.appointmentDate));
    const cycle = getUnivYear(appointmentDate);
    const currentMonth = appointmentDate.getMonth() + 1;
    const isInPeriod = period ? currentMonth === period.month : true;
    const curatedPatient = getCuratedPatient(appointment);
    const applyNewRules = appointmentDate >= START_NEW_RULES;
    const MAX_APPOINTMENT = getMaxAppointmentCount(appointmentDate);

    const patientAppointments = appointmentsCountByPatient.get(cycle)?.get(curatedPatient) || [];
    const previousAppointment = patientAppointments.slice(-1)[0];

    const appointmentInfo = createAppointmentInfo(previousAppointment, appointmentDate, applyNewRules);

    /* New rule */
    if (applyNewRules && appointmentInfo.count <= MAX_APPOINTMENT) {
      appointmentInfo.badges.push(appointmentBadges.new_rules);
    }
    /* End new rule */

    if (isBillingPurposes) {
      addBillingBadges(
        appointmentInfo,
        appointmentDate,
        applyNewRules,
        MAX_APPOINTMENT,
        START_CYCLE_DATE,
        START_FIRST_DATE,
      );
    } else {
      addNonBillingBadges(appointmentInfo, psychologistId, appointment, MAX_APPOINTMENT, applyNewRules);
    }

    /* New rule */
    const nextAppointment = appointments[i + 1];
    const isLastAppointment = !nextAppointment || (nextAppointment.INE !== curatedPatient
      && cycle !== getUnivYear(new Date(nextAppointment.appointmentDate)));

    if (!applyNewRules && appointmentDate > START_CYCLE_DATE
      && isLastAppointment
      && containBadges(appointmentInfo.badges, warningBadges)) {
      appointmentInfo.badges.push(appointmentBadges.switch_rule_notice);
    }

    processNextAppointment(
      nextAppointment,
      cycle,
      curatedPatient,
      applyNewRules,
      patientAppointments,
      appointmentInfo,
      START_CYCLE_DATE,
      warningBadges,
    );
    /* End new rule */

    if ((!isBillingPurposes || !appointmentInfo.badges.includes(appointmentBadges.exceeded)) && isInPeriod) {
      appointmentsWithBadges.push({ ...appointment, badges: appointmentInfo.badges });
    }

    if (!appointmentsCountByPatient.has(cycle)) {
      appointmentsCountByPatient.set(cycle, new Map());
    }
    const cycleAppointments = appointmentsCountByPatient.get(cycle);
    if (!cycleAppointments.has(curatedPatient)) {
      cycleAppointments.set(curatedPatient, []);
    }
    cycleAppointments.get(curatedPatient).push(appointmentInfo);
  });

  return appointmentsWithBadges.sort((a, b) => new
  Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());
};

export {
  getAppointmentWithBadges,
  getPatientWithBadges,
};
