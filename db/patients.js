const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

module.exports.patientsTable = "patients";

module.exports.getPatients = async () => {
  try {
    const patientArray = await knex(module.exports.patientsTable).select()
        .orderBy("lastName")
    return patientArray
  } catch (err) {
    console.error(`Impossible de récupérer les patients`, err)
    throw new Error(`Impossible de récupérer les patients`)
  }
}

const insertPatient = async (firstNames, lastName, INE) => {
  try {
    const patientsArray = await knex(module.exports.patientsTable).insert({
      firstNames,
      lastName,
      INE,
    }).returning("*");
    return patientsArray[0];
  } catch (err) {
    console.error("Erreur de sauvegarde du patient", err)
    throw new Error("Erreur de sauvegarde du patient")
  }
}
module.exports.insertPatient = insertPatient
