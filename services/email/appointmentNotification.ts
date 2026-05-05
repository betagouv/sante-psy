import ejs from 'ejs';
import config from '../../utils/config';
import sendEmail from '../../utils/email';

const sendAppointmentNotificationEmail = async (email: string): Promise<void> => {
    const html = await ejs.renderFile('./views/emails/appointmentNotification.ejs', {
        loginLink: `${config.hostnameWithProtocol}/espace-etudiant`,
    });
    await sendEmail(email, 'Notification de séance', html);
};

export default sendAppointmentNotificationEmail;
