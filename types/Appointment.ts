import { Patient } from './Patient';

export type Appointment = {
    id: string,
    psychologistId: string,
    appointmentDate: string,
    patientId: string,
    deleted: boolean,
    badge?: string,
}

export type AppointmentWithPatient = Appointment & Patient;
