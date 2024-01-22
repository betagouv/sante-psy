import { AppointmentWithPatient } from '../types/Appointment';
import dateUtils from '../utils/date';

const extractFirstAppointments = (appointments: AppointmentWithPatient[]): AppointmentWithPatient[] => {
  const START_CYCLE_DATE = new Date('2023-09-01T00:00:00Z');
  const START_FIRST_DATE = new Date('2024-01-01T00:00:00Z');
  const FIRST_CYCLE = '2023-2024';
  const SEPTEMBER = 8;
  const DECEMBER = 11;
  const firstAppointmentsByPatient = {};
  const firstCyclePatientToIgnore = [];

  appointments.forEach((appointment) => {
    const appointmentDate = dateUtils.getUTCDate(new Date(appointment.appointmentDate));
    if (appointmentDate >= START_CYCLE_DATE && appointmentDate <= START_FIRST_DATE) {
      firstCyclePatientToIgnore.push(appointment.patientId);
    }
  });

  const firstAppointments = appointments.filter((appointment: (AppointmentWithPatient)) => {
    const appointmentDate = dateUtils.getUTCDate(new Date(appointment.appointmentDate));
    const toIgnore = appointmentDate > START_FIRST_DATE && firstCyclePatientToIgnore.includes(appointment.patientId);
    const cycle = (appointmentDate.getMonth() >= SEPTEMBER && appointmentDate.getMonth() <= DECEMBER)
      ? `${appointmentDate.getFullYear()}-${appointmentDate.getFullYear() + 1}`
      : `${appointmentDate.getFullYear() - 1}-${appointmentDate.getFullYear()}`;

    if (!firstAppointmentsByPatient[cycle]) {
      firstAppointmentsByPatient[cycle] = {};
    }

    if (cycle === FIRST_CYCLE && toIgnore) {
      return false;
    }

    if (!firstAppointmentsByPatient[cycle][appointment.patientId] && appointmentDate > START_FIRST_DATE) {
      firstAppointmentsByPatient[cycle][appointment.patientId] = true;
      return true;
    }

    return false;
  });

  return firstAppointments;
};

export default extractFirstAppointments;
