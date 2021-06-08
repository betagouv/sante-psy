const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);
const date = require('../utils/date');
const { patientsTable } = require('./tables');

module.exports.getPatientById = async (patientId, psychologistId) => {
  try {
    const patient = await knex(patientsTable)
      .where('id', patientId)
      .where('psychologistId', psychologistId)
      .first();

    return patient;
  } catch (err) {
    console.error('Erreur de récupération du patient', err);
    throw new Error('Erreur de récupération du patient');
  }
};

module.exports.getPatients = async (psychologistId) => {
  try {
    const patientArray = await knex(patientsTable)
        .where('psychologistId', psychologistId)
        .where('deleted', false)
        .orderBy('lastName');
    return patientArray;
  } catch (err) {
    console.error('Impossible de récupérer les patients', err);
    throw new Error('Impossible de récupérer les patients');
  }
};

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
  dateOfBirth,
) => {
  try {
    const patientsArray = await knex(patientsTable).insert({
      firstNames,
      lastName,
      INE,
      institutionName,
      isStudentStatusVerified,
      hasPrescription,
      psychologistId,
      doctorName,
      doctorAddress,
      dateOfBirth,
    }).returning('*');
    return patientsArray[0];
  } catch (err) {
    console.error('Erreur de sauvegarde du patient', err);
    throw new Error('Erreur de sauvegarde du patient');
  }
};

module.exports.updatePatient = async (
  id, firstNames, lastName, INE, institutionName, isStudentStatusVerified, hasPrescription, psychologistId, doctorName,
  doctorAddress, dateOfBirth,
) => {
  try {
    return await knex(patientsTable)
      .where('id', id)
      .where('psychologistId', psychologistId)
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
        dateOfBirth,
        updatedAt: date.getDateNowPG(),
      });
  } catch (err) {
    console.error('Erreur de modification du patient', err);
    throw new Error('Erreur de modification du patient');
  }
};

module.exports.deletePatient = async (id, psychologistId) => {
  try {
    const deletedPatient = await knex(patientsTable)
      .where('id', id)
      .where('psychologistId', psychologistId)
      .update({
        deleted: true,
        updatedAt: date.getDateNowPG(),
      });

    console.log(`Patient id ${id} deleted by psy id ${psychologistId}`);

    return deletedPatient;
  } catch (err) {
    console.error('Erreur de suppression du patient', err);
    throw new Error('Erreur de suppression du patient');
  }
};
