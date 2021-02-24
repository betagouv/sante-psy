const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const dbPatient = require('./patients')

module.exports.appointmentsTable =  "appointments";

// todo: bug : if appointment has a patientId that does not match a patient object in the db,
// this function returns empty.
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
    const insertedArray = await knex(module.exports.appointmentsTable).insert({
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
