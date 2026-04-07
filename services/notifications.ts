import { Student } from '../types/Student';
import sendAppointmentNotificationEmail from './email/appointmentNotification';

export const notifyStudentNewAppointment = async (student: Student | null): Promise<void> => {
  if (!student) {
    console.warn("Can't notify null student.");
  }

  try {
    // TODO: check if user wants to be notified by email
    await sendAppointmentNotificationEmail(student.email);
  } catch (err) {
    console.error('Failed to send appointment notification email', err);
  }

  // TODO: check if user wants to be notified by sms and if so implement notification by SMS
};
