require('dotenv').config();

const ejs = require('ejs');

const date = require("../utils/date");
const logs = require('../utils/logs');
const config = require('../utils/config');
const emailUtils = require('../utils/email');
const dbAppointments = require("../db/appointments");
const dbUniversities = require("../db/universities");


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

module.exports.getSummariesForUniversities = getSummariesForUniversities

async function formatSummaryEmail(summaryDate, psychologists) {
  const html = await ejs.renderFile('./views/emails/summaryUniversity.ejs', {
    lastMonth: summaryDate.lastMonth,
    year: summaryDate.year,
    psychologists: psychologists
  });
  return html
}

const sendMailToUniversities = async (summaryUniversities, summaryDate) => {
  const allUniversities = await dbUniversities.getUniversities()

  allUniversities.forEach(async (university) => {
    const summaryUniversity = summaryUniversities[university.id]
    if (summaryUniversity) {
      const htmlFormated = await formatSummaryEmail(summaryDate, summaryUniversity);

      if (!university.emailSSU && !university.emailUniversity) {
        console.log(`Summary could not be send. ${university.name} doesn't have email.`)
        return;
      }
      const currentEmails = university.emailUniversity ?
        university.emailUniversity.split(' ; ') :
        university.emailSSU.split(' ; ')
      currentEmails.forEach(async (email) => {
        await emailUtils.sendMail(email, `Résumé des séances ${config.appName}`, htmlFormated);
        console.log(`Summary sent for ${logs.hashForLogs(university.email)}`);
      })
    }
  })
}

const SendSummaryToUniversities = async () => {
  console.log("Starting SendSummaryToUniversities...");
  const summaryDate = date.getLastMonthAndYear(new Date())
  console.log(`last month: ${summaryDate.lastMonth} and year ${summaryDate.year}`)

  try {
    const allAppointmentsSummary = await dbAppointments.getMonthlyAppointmentsSummary(
      summaryDate.year,
      summaryDate.lastMonth
    )
    const summariesForUniversities = getSummariesForUniversities(allAppointmentsSummary)
    sendMailToUniversities(summariesForUniversities, summaryDate)
    console.log("SendSummaryToUniversities done")
  } catch (err) {
    console.error("ERROR: Could not send psychologists informations to universities.", err)
  }
}
module.exports.SendSummaryToUniversities = SendSummaryToUniversities
