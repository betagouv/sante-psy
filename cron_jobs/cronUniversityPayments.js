require('dotenv').config();

const date = require("../utils/date");
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

const run = async () => {
  const { year, lastMonth } = date.getLastMonthAndYear(new Date())
  console.log(`last month: ${lastMonth} and year ${year}`)

  try {
    const allAppointmentsSummary = await dbAppointments.getMonthlyAppointmentsSummary(year, lastMonth)
    const summariesForUniversities = getSummariesForUniversities(allAppointmentsSummary)
    console.log(summariesForUniversities)
  } catch (err) {
    console.error("ERROR: Could not get universities informations", err)
  }
}

module.exports.getSummariesForUniversities = getSummariesForUniversities
