const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const dbPatient = require('./patients')
const date = require("../utils/date");

const appointmentsTable = "appointments"
module.exports.appointmentsTable = appointmentsTable;

// todo: bug : if appointment has a patientId that does not match a patient object in the db,
// this function returns empty.
module.exports.getAppointments = async (psychologistId) => {
  try {
    const appointmentArray = await knex.from(dbPatient.patientsTable)
      .innerJoin(`${appointmentsTable}`, `${dbPatient.patientsTable}.id`, `${appointmentsTable}.patientId`)
      .where(`${appointmentsTable}.psychologistId`, psychologistId)
      .whereNot(`${appointmentsTable}.deleted`, true)
      .orderBy("appointmentDate", "desc")
    return appointmentArray
  } catch (err) {
    console.error(`Impossible de récupérer les appointments`, err)
    throw new Error(`Impossible de récupérer les appointments`)
  }
}

module.exports.insertAppointment = async (appointmentDate, patientId, psychologistId) => {
  try {
    const insertedArray = await knex(appointmentsTable).insert({
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
    const deletedAppointments = await knex(appointmentsTable)
      .where({
        id: appointmentId,
        psychologistId: psychologistId
      })
      .update({
        deleted: true,
        updatedAt: date.getDateNowPG()
      })

    console.log(`Appointment id ${appointmentId} deleted by psy id ${psychologistId}`);

    return deletedAppointments
  } catch (err) {
    console.error("Erreur de suppression du appointments", err)
    throw new Error("Erreur de suppression du appointments")
  }
}
