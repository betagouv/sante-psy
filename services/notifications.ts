import { Student } from '../types/Student';
import sendAppointmentNotificationEmail from './email/appointmentNotification';

export const notifyStudentNewAppointment = async (student: Student | null): Promise<void> => {
  if (!student) {
    console.warn("Can't notify null student.");
  }

  try {
    await sendAppointmentNotificationEmail(student.email);
  } catch (err) {
    console.error('Failed to send appointment notification email', err);
  }
};
