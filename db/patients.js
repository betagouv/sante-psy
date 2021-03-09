const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

module.exports.patientsTable = "patients";

module.exports.getPatientById = async (patientId, psychologistId) => {
  try {
    const patient =  await knex(module.exports.patientsTable)
      .where("id", patientId)
      .where("psychologistId", psychologistId)
      .first();

    return patient;
  } catch (err) {
    console.error("Erreur de récupération du patient", err)
    throw new Error("Erreur de récupération du patient")
  }
}

module.exports.getPatients = async (psychologistId) => {
  try {
    const patientArray = await knex(module.exports.patientsTable)
        .where("psychologistId", psychologistId)
        .orderBy("lastName")
    return patientArray
  } catch (err) {
    console.error(`Impossible de récupérer les patients`, err)
    throw new Error(`Impossible de récupérer les patients`)
  }
}

module.exports.insertPatient = async (firstNames, lastName, INE, psychologistId, doctorId) => {
  try {
    const patientsArray = await knex(module.exports.patientsTable).insert({
      firstNames,
      lastName,
      INE,
      psychologistId,
      doctorId,
    }).returning('*')
    return patientsArray[0]
  } catch (err) {
    console.error("Erreur de sauvegarde du patient", err)
    throw new Error("Erreur de sauvegarde du patient")
  }
}

module.exports.updatePatient = async (id, firstNames, lastName, INE, psychologistId, doctorId) => {
  try {
    await knex(module.exports.patientsTable)
      .where("id", id)
      .where("psychologistId", psychologistId)
      .update({
        firstNames,
        lastName,
        INE,
        doctorId
      })
  } catch (err) {
    console.error("Erreur de modification du patient", err)
    throw new Error("Erreur de modification du patient")
  }
}
