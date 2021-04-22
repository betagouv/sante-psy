const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const date = require("../utils/date");

module.exports.patientsTable = "patients";
module.exports.studentNumberSize = 50;

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

module.exports.insertPatient = async (
  firstNames,
  lastName,
  INE,
  institutionName,
  isStudentStatusVerified,
  hasPrescription,
  psychologistId,
  doctorName,
  doctorAddress,
  doctorPhone ) => {
  try {
    const patientsArray = await knex(module.exports.patientsTable).insert({
      firstNames,
      lastName,
      INE,
      institutionName,
      isStudentStatusVerified,
      hasPrescription,
      psychologistId,
      doctorName,
      doctorAddress,
      doctorPhone,
    }).returning('*')
    return patientsArray[0]
  } catch (err) {
    console.error("Erreur de sauvegarde du patient", err)
    throw new Error("Erreur de sauvegarde du patient")
  }
}

module.exports.updatePatient = async (
  id, firstNames, lastName, INE, institutionName, isStudentStatusVerified, hasPrescription, psychologistId, doctorName,
  doctorAddress, doctorPhone) => {
  try {
    await knex(module.exports.patientsTable)
      .where("id", id)
      .where("psychologistId", psychologistId)
      .update({
        firstNames,
        lastName,
        INE,
        institutionName,
        isStudentStatusVerified,
        hasPrescription,
        psychologistId,
        doctorName,
        doctorAddress,
        doctorPhone,
        updatedAt: date.getDateNowPG()
      })
  } catch (err) {
    console.error("Erreur de modification du patient", err)
    throw new Error("Erreur de modification du patient")
  }
}
