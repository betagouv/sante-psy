import ejs from 'ejs';
import { Student } from '../types/Student';
import config from '../utils/config';
import sendEmail from '../utils/email';

const getSignature = (): string => {
  const team = ['Lina', 'Vikie', 'Valentin', 'Sandrine', 'Xavier'];
  const random = Math.floor(Math.random() * 5);
  return `${team[random]} de `;
};

const sendMail1 = async (email: string): Promise<void> => {
  const html = await ejs.renderFile('./views/emails/studentMail-1.ejs', {
    signature: getSignature(),
    faq: `${config.hostnameWithProtocol}/faq`,
    parcours: `${config.hostnameWithProtocol}/static/documents/parcours_etudiant_sante_psy_etudiant.pdf`,
  });
  await sendEmail(email, `Les informations concernant ${config.appName}`, html);
};

const sendMail2 = async (student: Student): Promise<void> => {
  const html = await ejs.renderFile('./views/emails/studentMail-2.ejs', {
    signature: getSignature(),
    site: `${config.hostnameWithProtocol}`,
    contact: `${config.hostnameWithProtocol}/contact`,
  });
  return sendEmail(student.email, 'Comment te sens-tu en ce moment ?', html);
};

const sendMail3 = async (student: Student): Promise<void> => {
  const html = await ejs.renderFile('./views/emails/studentMail-3.ejs', {
    signature: getSignature(),
    faq: `${config.hostnameWithProtocol}/faq`,
    letter: `${config.hostnameWithProtocol}/enregistrement/${student.id}?letter=`,
  });
  return sendEmail(student.email, 'On vient prendre de tes nouvelles !', html);
};

const sendMail4 = async (student: Student): Promise<void> => {
  const html = await ejs.renderFile('./views/emails/studentMail-4.ejs', {
    signature: getSignature(),
    faq: `${config.hostnameWithProtocol}/faq`,
    appointment: `${config.hostnameWithProtocol}/enregistrement/${student.id}?appointment=`,
    referral: `${config.hostnameWithProtocol}/enregistrement/${student.id}?referral=`,
  });
  return sendEmail(student.email, 'Tout se passe bien pour toi ?', html);
};

export {
  sendMail1,
  sendMail2,
  sendMail3,
  sendMail4,
};
