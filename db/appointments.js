const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const dbPatient = require('./patients')

const appointmentsTable = "appointments"
module.exports.appointmentsTable = appointmentsTable;

// todo: bug : if appointment has a patientId that does not match a patient object in the db,
// this function returns empty.
module.exports.getAppointments = async (psychologistId) => {
  try {
    const appointmentArray = await knex.from(dbPatient.patientTable)
      // todo where psychologistId = current psy
      .innerJoin('appointments', 'patients.id', 'appointments.patientId')
      .where('psychologistId', psychologistId)
      .orderBy("appointmentDate", "desc")
    console.log('appointmentArray', appointmentArray)
    return appointmentArray
  } catch (err) {
    console.error(`Impossible de récupérer les appointments`, err)
    throw new Error(`Impossible de récupérer les appointments`)
  }
}

module.exports.insertAppointment = async (appointmentDate, patientId, psychologistId) => {
  try {
    const insertedArray = await knex(module.exports.appointmentsTable).insert({
      psychologistId,
      appointmentDate,
      patientId: patientId,
    }).returning("*")
    return insertedArray[0]
  } catch (err) {
    console.error("Erreur de sauvegarde du appointments", err)
    throw new Error("Erreur de sauvegarde du appointments")
  }
}

module.exports.deleteAppointment = async (appointmentId) => {
  try {
    return await knex("appointments")
      .where("id", appointmentId)
      .del()
  } catch (err) {
    console.error("Erreur de suppression du appointments", err)
    throw new Error("Erreur de suppression du appointments")
  }
}
