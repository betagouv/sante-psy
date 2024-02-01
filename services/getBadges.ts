import { AppointmentWithPatient } from '../types/Appointment';
import dateUtils from '../utils/date';

const getAppointmentBadges = (appointments: AppointmentWithPatient[]): AppointmentWithPatient[] => {
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

    let badge = null;
    if (appointmentsCountByPatient[cycle][appointment.patientId] === 1) {
      badge = 'first';
    } else if (appointmentsCountByPatient[cycle][appointment.patientId] === 8) {
      badge = 'max';
    } else if (appointmentsCountByPatient[cycle][appointment.patientId] > 8) {
      badge = 'exceeded';
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
