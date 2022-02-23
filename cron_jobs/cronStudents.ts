import ejs from 'ejs';
import students from '../db/students';
import config from '../utils/config';
import sendEmail from '../utils/email';

const send = async (mail: string): Promise<void> => {
  const team = ['Lina', 'Vikie', 'Valentin', 'Sandrine', 'Xavier'];
  const random = Math.floor(Math.random() * 5);
  const html = await ejs.renderFile('./views/emails/studentMail-2.ejs', {
    signature: `${team[random]} de `,
    faq: `${config.hostnameWithProtocol}/faq`,
    parcours: `${config.hostnameWithProtocol}/static/documents/parcours_etudiant_sante_psy_etudiant.pdf`,
  });
  return sendEmail(mail, `Les informations concernant ${config.appName}`, html);
};

const sendStudentsMail = async () : Promise<void> => {
  const now = new Date();
  const from = new Date();
  const to = new Date();
  from.setDate(now.getDate() - 3);
  to.setDate(now.getDate() - 3);
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  const results = await students.getAllMailBetween(from, to);

  await Promise.all(results.map((email) => send(email)));
  console.log(`${results.length} mails sent`);
};

export default { sendStudentsMail };
