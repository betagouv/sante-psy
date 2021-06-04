import dotenv from 'dotenv';
import ejs from 'ejs';

import logs from '../utils/logs';
import config from '../utils/config';
import emailUtils from '../utils/email';
import dbUniversities from '../db/universities';

dotenv.config();

const getSummariesForUniversities = (allAppointmentsSummary) => {
  const universityContent = {};
  /*
  Example data :
  universityContent = {
    'univ-1': [
      { psychologistId: 'psy-id-1', firstNames, lastName, personalEmail },
      { psychologistId: 'psy-id-2', firstNames, lastName, personalEmail }
    ],
    'univ-2': [
      { psychologistId: 'psy-id-a', firstNames, lastName, personalEmail },
      { psychologistId: 'psy-id-b', firstNames, lastName, personalEmail }
    ]
  }
  */
  allAppointmentsSummary.forEach((monthlyAppointment) => {
    if (!universityContent[monthlyAppointment.universityId]) {
      universityContent[monthlyAppointment.universityId] = [];
    }
    const item = {
      psychologistId: monthlyAppointment.psychologistId,
      firstNames: monthlyAppointment.firstNames,
      lastName: monthlyAppointment.lastName,
      personalEmail: monthlyAppointment.personalEmail,
      countAppointments: monthlyAppointment.countAppointments,
    };
    universityContent[monthlyAppointment.universityId].push(item);
  });
  return universityContent;
};

const sendMailToUniversities = async () => {
  const allUniversities = await dbUniversities.getUniversities();

  allUniversities.forEach(async (university) => {
    if (!university.emailSSU && !university.emailUniversity) {
      console.log(`Summary could not be send. ${university.name} doesn't have email.`);
      return;
    }

    const htmlFormated = await ejs.renderFile('./views/emails/summaryUniversity.ejs');
    const emailsTo = dbUniversities.getEmailsTo(university);
    if (emailsTo) {
      await emailUtils.sendMail(
        emailsTo,
        `Résumé des séances ${config.appName}`,
        htmlFormated,
        '', // cc mail
        config.contactEmail, // bcc mail
      );
      console.log(`Summary sent for ${university.name} - ${logs.hashForLogs(emailsTo)}`);
    }
  });
};

const sendSummaryToUniversities = async () => {
  console.log('Starting sendSummaryToUniversities...');

  try {
    sendMailToUniversities();
    console.log('sendSummaryToUniversities done');
  } catch (err) {
    console.error('ERROR: Could not send psychologists informations to universities.', err);
  }
};

export default {
  sendSummaryToUniversities,
  getSummariesForUniversities,
};
