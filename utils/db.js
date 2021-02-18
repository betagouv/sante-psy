const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

module.exports.getAppointments = async () => {
  try {
    const appointmentArray = await knex.from('patients')
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
    return await knex("appointments").insert({
      appointmentDate,
      patientId: patientId,
    }).returning("*")
  } catch (err) {
    console.error("Erreur de sauvegarde du appointments", err)
    throw new Error("Erreur de sauvegarde du appointments")
  }
}

module.exports.getPatients = async () => {
  try {
    const patientArray = await knex("patients").select()
        .orderBy("lastName")
    return patientArray
  } catch (err) {
    console.error(`Impossible de récupérer les patients`, err)
    throw new Error(`Impossible de récupérer les patients`)
  }
}

const insertPatient = async (firstNames, lastName, studentNumber) => {
  try {
    return await knex("patients").insert({
      firstNames,
      lastName,
      INE: studentNumber,
    })
  } catch (err) {
    console.error("Erreur de sauvegarde du patient", err)
    throw new Error("Erreur de sauvegarde du patient")
  }
}
module.exports.insertPatient = insertPatient
