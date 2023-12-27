import { AppointmentWithPatient } from '../types/Appointment';
import dateUtils from './date';

const extractFirstAppointments = (appointments: AppointmentWithPatient[]): AppointmentWithPatient[] => {
  const startCycle = new Date('2024-01-01T00:00:00Z');
  const SEPTEMBER = 8;
  const DECEMBER = 11;
  const firstAppointmentsByPatient = {};

  const firstAppointments = appointments.filter((appointment: (AppointmentWithPatient)) => {
    let appointmentDate = new Date(appointment.appointmentDate);
    appointmentDate = dateUtils.getUTCDate(appointmentDate);
    const cycle = (appointmentDate.getMonth() >= SEPTEMBER && appointmentDate.getMonth() <= DECEMBER)
      ? `${appointmentDate.getFullYear()}-${appointmentDate.getFullYear() + 1}`
      : `${appointmentDate.getFullYear() - 1}-${appointmentDate.getFullYear()}`;

    if (!firstAppointmentsByPatient[cycle]) {
      firstAppointmentsByPatient[cycle] = {};
    }

    if (!firstAppointmentsByPatient[cycle][appointment.patientId] && appointmentDate > startCycle) {
      firstAppointmentsByPatient[cycle][appointment.patientId] = true;
      return true;
    }

    return false;
  });

  return firstAppointments;
};

export default extractFirstAppointments;
