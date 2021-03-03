const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const dbPatient = require('./patients')

const appointmentsTable = "appointments"
module.exports.appointmentsTable = appointmentsTable;

// todo: bug : if appointment has a patientId that does not match a patient object in the db,
// this function returns empty.
module.exports.getAppointments = async (psychologistId) => {
  try {
    const appointmentArray = await knex.from(dbPatient.patientsTable)
      .innerJoin(`${appointmentsTable}`, `${dbPatient.patientsTable}.id`, `${appointmentsTable}.patientId`)
      .where(`${appointmentsTable}.psychologistId`, psychologistId)
      .orderBy("appointmentDate", "desc")
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

module.exports.deleteAppointment = async (appointmentId, psychologistId) => {
  try {
    const deletedAppointments = await knex("appointments")
      .where({
        id: appointmentId,
        psychologistId: psychologistId
      })       
      .del() // Julien : ça peut être intéressant de ne pas supprimer en base et de garder une trace de tout
             // Pourquoi : si vous avez besoins de voir si un psychologue fraud ou en cas d'erreur
             // Comment: utiliser un flag de suppression
             // Note : vous pouvez faire une suppression compléte X mois après l'activation du flag
      .returning('*')
    if (deletedAppointments.length === 0) {
      console.error("Appointment not deleted : does not exist or is not allowed")
      throw new Error("Appointment not deleted : does not exist or is not allowed")
    }
    return deletedAppointments
  } catch (err) {
    console.error("Erreur de suppression du appointments", err)
    throw new Error("Erreur de suppression du appointments")
  }
}
