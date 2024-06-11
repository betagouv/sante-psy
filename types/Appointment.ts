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

export interface AppointmentByYear {[univYear: string]: Appointment[]}

export type AppointmentInfo = {
    date: Date,
    badges: string[],
    count: number,
}
