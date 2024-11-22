import ejs from 'ejs';
import { Student } from '../types/Student';
import config from '../utils/config';
import sendEmail from '../utils/email';

const getSignature = (): string => {
  const team = ['Lina', 'Vikie', 'Kévin', 'Sandrine', 'Samy', 'Anaïs', 'Donia'];
  const random = Math.floor(Math.random() * 7);
  return `${team[random]} de `;
};

const sendMail1 = async (email: string): Promise<void> => {
  const html = await ejs.renderFile('./views/emails/studentMail-1.ejs', {
    signature: getSignature(),
    faq: `${config.hostnameWithProtocol}/faq`,
    site: `${config.hostnameWithProtocol}`,
  });
  await sendEmail(email, `Les informations concernant ${config.appName}`, html);
};

const sendMail2 = async (student: Student): Promise<void> => {
  const html = await ejs.renderFile('./views/emails/studentMail-2.ejs', {
    signature: getSignature(),
    site: `${config.hostnameWithProtocol}`,
    contact: `${config.hostnameWithProtocol}/contact`,
    unregister: `${config.hostnameWithProtocol}/desinscription/${student.id}`,
  });
  return sendEmail(student.email, 'Comment te sens-tu en ce moment ?', html);
};

const sendMail3 = async (student: Student): Promise<void> => {
  const html = await ejs.renderFile('./views/emails/studentMail-3.ejs', {
    signature: getSignature(),
    faq: `${config.hostnameWithProtocol}/faq`,
    letter: `${config.hostnameWithProtocol}/enregistrement/${student.id}?letter=`,
    unregister: `${config.hostnameWithProtocol}/desinscription/${student.id}`,
  });
  return sendEmail(student.email, 'On vient prendre de tes nouvelles !', html);
};

const sendMail4 = async (student: Student): Promise<void> => {
  const html = await ejs.renderFile('./views/emails/studentMail-4.ejs', {
    signature: getSignature(),
    faq: `${config.hostnameWithProtocol}/faq`,
    appointment: `${config.hostnameWithProtocol}/enregistrement/${student.id}?appointment=`,
    unregister: `${config.hostnameWithProtocol}/desinscription/${student.id}`,
  });
  return sendEmail(student.email, 'Tout se passe bien pour toi ?', html);
};

const sendMailDoctorAppointment = async (student: Student): Promise<void> => {
  const html = await ejs.renderFile('./views/emails/studentMail-doctorAppointment.ejs', {
    signature: getSignature(),
    faq: `${config.hostnameWithProtocol}/faq`,
    doctorAppointment: `${config.hostnameWithProtocol}/enregistrement/${student.id}?doctorAppointment=`,
    unregister: `${config.hostnameWithProtocol}/desinscription/${student.id}`,
  });
  return sendEmail(student.email, 'As-tu réussi à rencontrer un médecin ?', html);
};

const sendMailDoctorAppointment2 = async (student: Student): Promise<void> => {
  const html = await ejs.renderFile('./views/emails/studentMail-doctorAppointment-2.ejs', {
    signature: getSignature(),
    faq: `${config.hostnameWithProtocol}/faq`,
    doctorAppointment: `${config.hostnameWithProtocol}/enregistrement/${student.id}?doctorAppointment2=`,
    unregister: `${config.hostnameWithProtocol}/desinscription/${student.id}`,
  });
  return sendEmail(student.email, 'Tout se passe bien pour toi ?', html);
};

export {
  sendMail1,
  sendMail2,
  sendMail3,
  sendMail4,
  sendMailDoctorAppointment,
  sendMailDoctorAppointment2,
};
