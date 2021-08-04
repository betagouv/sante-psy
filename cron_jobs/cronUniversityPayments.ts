import dotenv from 'dotenv';
import ejs from 'ejs';

import logs from '../utils/logs';
import config from '../utils/config';
import sendEmail from '../utils/email';
import dbUniversities from '../db/universities';

dotenv.config();

const sendMailToUniversities = async (): Promise<void> => {
  const allUniversities = await dbUniversities.getAll();

  const sendMails = allUniversities.map(async (university) => {
    if (!university.emailSSU && !university.emailUniversity) {
      console.log(`Summary could not be send. ${university.name} doesn't have email.`);
      return Promise.resolve();
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

    return Promise.resolve();
  });

  await Promise.all(sendMails);
};

const sendSummaryToUniversities = async (): Promise<boolean> => {
  console.log('Starting sendSummaryToUniversities...');

  try {
    await sendMailToUniversities();
    console.log('sendSummaryToUniversities done');
  } catch (err) {
    console.error('ERROR: Could not send psychologists informations to universities.', err);
  }

  return true;
};

export default {
  sendSummaryToUniversities,
};
