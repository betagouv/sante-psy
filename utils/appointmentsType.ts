import { AppointmentsType } from '../types/Appointment';

const appointmentsType: {[key in AppointmentsType]: AppointmentsType} = {
  appointment: 'appointment',
  patient: 'patient',
  billing: 'billing',
};

export default appointmentsType;
