import dotenv from 'dotenv';
import ejs from 'ejs';

import logs from '../utils/logs';
import config from '../utils/config';
import sendEmail from '../utils/email';
import dbUniversities from '../db/universities';
import dbAppointments from '../db/appointments';

dotenv.config();

const sendMailToUniversities = async (): Promise<void> => {
  const allUniversities = await dbUniversities.getAll();

  allUniversities.forEach(async (university) => {
    if (!university.emailSSU && !university.emailUniversity) {
      console.log(`Summary could not be send. ${university.name} doesn't have email.`);
      return;
    }

    const htmlFormated = await ejs.renderFile('./views/emails/summaryUniversity.ejs');
    const emailsTo = dbUniversities.getEmailsTo(university);
    if (emailsTo) {
      await sendEmail(
        emailsTo,
        `Résumé des séances ${config.appName}`,
        htmlFormated,
        '', // cc mail
        config.contactEmail, // bcc mail
      );
      console.log(`Summary sent for ${university.name} - ${logs.hash(emailsTo)}`);
    }
  });
};

const sendMailToMESRI = async (): Promise<void> => {
  const appointments = await dbAppointments.getLastWeekByUniversity();
  console.log(appointments);
  const htmlFormated = await ejs.renderFile('./views/emails/summaryMESRI.ejs', {
    appointments,
    total: appointments.reduce((acc, appointment) => acc + parseInt(appointment.count), 0),
  });
  const emailsTo = config.emailsMESRI;
  await sendEmail(
    emailsTo,
    `Résumé des séances ${config.appName}`,
    htmlFormated,
    '',
    config.contactEmail,
  );
  console.log('Summary sent to MESRI');
};

const sendSummaryToUniversities = async (): Promise<boolean> => {
  console.log('Starting sendSummaryToUniversities...');

  try {
    sendMailToUniversities();
    console.log('sendSummaryToUniversities done');
  } catch (err) {
    console.error('ERROR: Could not send appointments informations to universities.', err);
  }

  return true;
};

const sendSummaryToMESRI = async (): Promise<boolean> => {
  console.log('Starting sendSummaryToMESRI...');

  try {
    await sendMailToMESRI();
    console.log('sendSummaryToMESRI done');
  } catch (err) {
    console.error('ERROR: Could not send appointments informations to MESRI.', err);
  }

  return true;
};

export default {
  sendSummaryToUniversities,
  sendSummaryToMESRI,
};
