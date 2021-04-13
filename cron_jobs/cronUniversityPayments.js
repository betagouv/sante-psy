require('dotenv').config();

const ejs = require('ejs');

const date = require("../utils/date");
const logs = require('../utils/logs');
const config = require('../utils/config');
const emailUtils = require('../utils/email');
const dbAppointments = require("../db/appointments");


const getSummariesForUniversities = (allAppointmentsSummary) => {
  const universityContent = {}
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
  allAppointmentsSummary.forEach(monthlyAppointment => {
    if (!universityContent[monthlyAppointment.universityId]) {
      universityContent[monthlyAppointment.universityId] = []
    }
    const item = {
      "psychologistId": monthlyAppointment.psychologistId,
      "firstNames": monthlyAppointment.firstNames,
      "lastName": monthlyAppointment.lastName,
      "personalEmail": monthlyAppointment.personalEmail,
      "countAppointments": monthlyAppointment.countAppointments
    }
    universityContent[monthlyAppointment.universityId].push(item)
  })
  return universityContent
}

async function sendSummaryEmail(email, lastMonth, psy) {
  try {
    const html = await ejs.renderFile('./views/emails/summaryUniversity.ejs', {
      lastMonth: lastMonth,
      psychologists: psy
    });
    await emailUtils.sendMail(email, `Résumé des séances ${config.appName}`, html);
    console.log(`Summary sent for ${logs.hashForLogs(email)}`);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail - résumé des séances");
  }
}

const sendMailToUniversities = (summaryUniversities, lastMonth) => {
  for (let key in summaryUniversities) {
    if (summaryUniversities[key]) {
      sendSummaryEmail('emeline.merliere@beta.gouv.fr', lastMonth, summaryUniversities[key])
      console.log('Email send')
      return true
    }
  }
}


const run = async () => {
  const { year, lastMonth } = date.getLastMonthAndYear(new Date())
  console.log(`last month: ${lastMonth} and year ${year}`)

  try {
    const allAppointmentsSummary = await dbAppointments.getMonthlyAppointmentsSummary(year, 4)
    const summariesForUniversities = getSummariesForUniversities(allAppointmentsSummary)
    console.log(summariesForUniversities)
    sendMailToUniversities(summariesForUniversities)
  } catch (err) {
    console.error("ERROR: Could not send psychologists informations to universities.", err)
  }
}
run();
module.exports.getSummariesForUniversities = getSummariesForUniversities
