const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const dbPatient = require('./patients')

module.exports.appointmentsTable =  "appointments";

module.exports.getAppointments = async () => {
  try {
    const appointmentArray = await knex.from(dbPatient.patientTable)
        .innerJoin('appointments', 'patients.id', 'appointments.patientId')
    .orderBy("appointmentDate", "desc")
    return appointmentArray
  } catch (err) {
    console.error(`Impossible de récupérer les appointments`, err)
    throw new Error(`Impossible de récupérer les appointments`)
  }
}

module.exports.insertAppointment = async (appointmentDate, patientId) => {
  try {
    return await knex(module.exports.appointmentsTable).insert({
      appointmentDate,
      patientId: patientId,
    }).returning("*")
  } catch (err) {
    console.error("Erreur de sauvegarde du appointments", err)
    throw new Error("Erreur de sauvegarde du appointments")
  }
}