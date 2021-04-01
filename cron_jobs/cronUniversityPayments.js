require('dotenv').config();

const date = require("../utils/date");
const dbUniversities = require("../db/universities")
const dbAppointments = require("../db/appointments")

const getpsychologistsForEachUniversity = async () =>  {
  try {
    // const lastMonth = date.getLastMonth()
    // const year = date.getCurrentYear() //@TODO think about january where we need last year
    const lastMonth = 4
    const year = "2021"
    console.log(`last month: ${lastMonth}`)

    const allAppointmentById = await dbAppointments.getCountAppointmentsByYearMonthForUniversity(year, lastMonth)
    console.log("allAppointmentById", allAppointmentById);

    return allAppointmentById
  } catch (err) {
    console.error("ERROR: Could not get universities informations", err)
  }
}
console.log(getpsychologistsForEachUniversity())
module.exports.getpsychologistsForEachUniversity = getpsychologistsForEachUniversity
