const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const _ = require('lodash');

const doctorsTable = "doctors";

module.exports.doctorsTable = doctorsTable;

module.exports.getDoctorById = async (doctorId, psychologistId) => {
  try {
    const doctor =  await knex(doctorsTable)
      .where("id", doctorId)
      .where("psychologistId", psychologistId)
      .first();

    return doctor;
  } catch (err) {
    console.error("Erreur de récupération du medecin", err)
    throw new Error("Erreur de récupération du medecin")
  }
}

module.exports.getDoctors = async () => {
  try {
    const doctorArray = await knex(doctorsTable)
        .orderBy("lastName")

    return doctorArray
  } catch (err) {
    console.error(`Impossible de récupérer les medecins`, err)
    throw new Error(`Impossible de récupérer les medecins`)
  }
}

module.exports.checkDoctorIdExist = async function checkDoctorIdExist(doctorId, psychologistId) {
  const doctor = await this.getDoctorById(doctorId, psychologistId);

  if( doctor ) {
    return true;
  } else {
    console.error(`Doctor ID ${doctorId} does not exists for psy ID ${psychologistId}`);
    return false;
  }
}

module.exports.getDoctorsByPsychologist = async (psychologistId) => {
  try {
    const doctorArray = await knex(doctorsTable)
        .where("psychologistId", psychologistId)
        .orderBy("lastName")

    return doctorArray
  } catch (err) {
    console.error(`Impossible de récupérer les medecins`, err)
    throw new Error(`Impossible de récupérer les medecins`)
  }
}

module.exports.insertDoctor = async (psychologistId, firstNames, lastName, address, city, postalCode, phone) => {
  try {
    const capitalizedCity = _.capitalize(city)
    const doctorsArray = await knex(doctorsTable).insert({
      psychologistId,
      firstNames,
      lastName,
      address,
      city: capitalizedCity,
      postalCode,
      phone,
    }).returning('*')
    return doctorsArray[0]
  } catch (err) {
    console.error("Erreur de sauvegarde du medecin", err)
    throw new Error("Erreur de sauvegarde du medecin")
  }
}

module.exports.updateDoctor = async (id, psychologistId, firstNames, lastName, address,
  city, postalCode, phone) => {
  try {
    await knex(doctorsTable)
      .where("id", id)
      .update({
        psychologistId,
        firstNames,
        lastName,
        address,
        city,
        postalCode,
        phone
      })
  } catch (err) {
    console.error("Erreur de modification du medecin", err)
    throw new Error("Erreur de modification du medecin")
  }
}
