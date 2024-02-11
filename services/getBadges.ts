import { AppointmentWithPatient } from '../types/Appointment';
import dateUtils from '../utils/date';
import appointmentBadges from '../utils/badges';

const getAppointmentBadges = (appointments: AppointmentWithPatient[], isBillingPurposes = false)
: AppointmentWithPatient[] => {
  const START_CYCLE_DATE = new Date('2023-09-01T00:00:00Z');
  const START_FIRST_DATE = new Date('2024-01-01T00:00:00Z');
  const appointmentsWithStatus = [];
  const appointmentsCountByPatient = {};

  appointments.forEach((appointment) => {
    const appointmentDate = dateUtils.getUTCDate(new Date(appointment.appointmentDate));
    const cycle = dateUtils.getUnivYear(appointmentDate);

    if (!appointmentsCountByPatient[cycle]) {
      appointmentsCountByPatient[cycle] = {};
    }

    if (!appointmentsCountByPatient[cycle][appointment.patientId]) {
      appointmentsCountByPatient[cycle][appointment.patientId] = 1;
    }

    let badge = appointmentBadges.other;
    if (appointmentsCountByPatient[cycle][appointment.patientId] === 1) {
      if (!isBillingPurposes) {
        badge = appointmentBadges.first;
      } else if (!(appointmentDate >= START_CYCLE_DATE && appointmentDate <= START_FIRST_DATE)) {
        badge = appointmentBadges.first;
      }
    } else if (appointmentsCountByPatient[cycle][appointment.patientId] === 8) {
      badge = appointmentBadges.max;
    } else if (appointmentsCountByPatient[cycle][appointment.patientId] > 8) {
      badge = appointmentBadges.exceeded;
    }

    appointmentsWithStatus.push({
      ...appointment,
      badge,
    });

    appointmentsCountByPatient[cycle][appointment.patientId]++;
  });

  const orderedAppointments = appointmentsWithStatus.sort(
    (a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime(),
  );

  return orderedAppointments;
};

export default getAppointmentBadges;
