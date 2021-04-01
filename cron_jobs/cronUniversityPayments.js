require('dotenv').config();

const date = require("../utils/date");
const dbUniversities = require("../db/universities")
const dbAppointments = require("../db/appointments")

const getpsychologistsForEachUniversity = async () =>  {
  try {
    const lastMonth = date.getLastMonth()
    console.log(`last month: ${lastMonth}`)
    const universities2 = await dbUniversities.getUniversitiesWithPsy()
    const testUniversities = universities2.map(async university => {
      const allAppointmentById = await dbAppointments.getCountAppointmentsByYearMonth(university.psyId)
      if (allAppointmentById.length) {
        const hasAppointmentInMonth = allAppointmentById.find(appointment => appointment.month === lastMonth)
        return {
          ...university,
          countAppointments: hasAppointmentInMonth.countAppointments
        }
      } else {
        // psy sans consultation sur ce mois
        // console.log(university.psyId)
        return
      }
    })
    // console.log(testUniversities)
    return testUniversities
  } catch (err) {
    console.error("ERROR: Could not get universities informations", err)
  }
}
console.log(getpsychologistsForEachUniversity())


module.exports.getpsychologistsForEachUniversity = getpsychologistsForEachUniversity;
