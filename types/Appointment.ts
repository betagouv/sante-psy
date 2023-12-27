import { Patient } from './Patient';

export type Appointment = {
    id: string,
    psychologistId: string,
    appointmentDate: string,
    patientId: string,
    deleted: boolean
}

export type AppointmentWithPatient = Appointment & Patient;
