import { Patient } from './Patient';

export type Appointment = {
    id: string,
    psychologistId: string,
    appointmentDate: string,
    patientId: string,
    deleted: boolean,
    updatedAt?: string,
    createdAt?: string,
    badges?: [],
    univYear?: string,
}

export type AppointmentWithPatient = Appointment & Patient;

export type AppointmentsType = 'appointment' | 'billing' | 'patient';

export interface AppointmentByYear {[univYear: string]: Appointment[]}
