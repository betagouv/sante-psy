import ejs from 'ejs';
import config from '../../utils/config';
import sendEmail from '../../utils/email';

export type AppointmentsNotif = {
  date: Date;
  psyId: string;
};

export const sendAppointmentsNotificationEmail = async (
  email: string,
  remainingAppointments: number,
  appointments: AppointmentsNotif[],
): Promise<void> => {
  const nbPsys = new Set(appointments.map((item) => item.psyId)).size;
  const html = await ejs.renderFile(
    './views/emails/appointmentsNotification.ejs',
    {
      loginLink: `${config.hostnameWithProtocol}/espace-etudiant`,
      contactLink: `${config.hostnameWithProtocol}/contact/formulaire`,
      remainingSessions: remainingAppointments,
      nbPsys,
      appointments,
    },
  );
  await sendEmail(email, 'Notification de séance(s)', html);
};
