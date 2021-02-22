const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

module.exports.patientTable = "patients";

module.exports.getPatients = async () => {
  try {
    const patientArray = await knex(module.exports.patientTable).select()
        .orderBy("lastName")
    return patientArray
  } catch (err) {
    console.error(`Impossible de récupérer les patients`, err)
    throw new Error(`Impossible de récupérer les patients`)
  }
}

const insertPatient = async (firstNames, lastName, studentNumber) => {
  try {
    const patientsArray = await knex(module.exports.patientTable).insert({
      firstNames,
      lastName,
      INE: studentNumber,
    }).returning('*')
    return patientsArray[0]
  } catch (err) {
    console.error("Erreur de sauvegarde du patient", err)
    throw new Error("Erreur de sauvegarde du patient")
  }
}
module.exports.insertPatient = insertPatient
