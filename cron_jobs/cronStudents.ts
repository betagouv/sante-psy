import ejs from 'ejs';
import students from '../db/students';
import config from '../utils/config';
import sendEmail from '../utils/email';

const sendJ3 = async (mail: string): Promise<void> => {
  const team = ['Lina', 'Vikie', 'Valentin', 'Sandrine', 'Xavier'];
  const random = Math.floor(Math.random() * 5);
  const html = await ejs.renderFile('./views/emails/studentMail-2.ejs', {
    signature: `${team[random]} de `,
    site: `${config.hostnameWithProtocol}`,
    contact: `${config.hostnameWithProtocol}/contact`,
  });
  return sendEmail(mail, `Les informations concernant ${config.appName}`, html);
};

const sendJ10 = async (mail: string): Promise<void> => {
  const team = ['Lina', 'Vikie', 'Valentin', 'Sandrine', 'Xavier'];
  const random = Math.floor(Math.random() * 5);
  const token = '123'; // TODO get token from email
  const html = await ejs.renderFile('./views/emails/studentMail-3.ejs', {
    signature: `${team[random]} de `,
    faq: `${config.hostnameWithProtocol}/faq`,
    letter: `${config.hostnameWithProtocol}/enregistrement/${token}?letter=`,
  });
  return sendEmail(mail, `Les informations concernant ${config.appName}`, html);
};

const sendJ30 = async (mail: string): Promise<void> => {
  const team = ['Lina', 'Vikie', 'Valentin', 'Sandrine', 'Xavier'];
  const random = Math.floor(Math.random() * 5);
  const token = '123'; // TODO get token from email
  const html = await ejs.renderFile('./views/emails/studentMail-4.ejs', {
    signature: `${team[random]} de `,
    faq: `${config.hostnameWithProtocol}/faq`,
    appointment: `${config.hostnameWithProtocol}/enregistrement/${token}?appointment=`,
    referral: `${config.hostnameWithProtocol}/enregistrement/${token}?referral=`,
  });
  return sendEmail(mail, `Les informations concernant ${config.appName}`, html);
};

const sendStudentsMailJ3 = async (): Promise<void> => {
  const now = new Date();
  const from = new Date();
  const to = new Date();
  from.setDate(now.getDate() - 3);
  to.setDate(now.getDate() - 3);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  const results = await students.getAllMailBetween(from, to);

  await Promise.all(results.map((email) => sendJ3(email)));
  console.log(`${results.length} mails sent`);
};

const sendStudentsMailJ10 = async (): Promise<void> => {
  const now = new Date();
  const from = new Date();
  const to = new Date();
  from.setDate(now.getDate() - 3);
  to.setDate(now.getDate() - 3);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  const results = await students.getAllMailBetween(from, to);

  await Promise.all(results.map((email) => sendJ10(email)));
  console.log(`${results.length} mails sent`);
};

const sendStudentsMailJ30 = async (): Promise<void> => {
  const now = new Date();
  const from = new Date();
  const to = new Date();
  from.setDate(now.getDate() - 3);
  to.setDate(now.getDate() - 3);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  const results = await students.getAllMailBetween(from, to);

  await Promise.all(results.map((email) => sendJ30(email)));
  console.log(`${results.length} mails sent`);
};

export default { sendStudentsMailJ3, sendStudentsMailJ10, sendStudentsMailJ30 };
