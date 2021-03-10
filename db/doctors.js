const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const _ = require('lodash');
const date = require('../utils/date');

const doctorsTable = "doctors";

module.exports.doctorsTable = doctorsTable;

module.exports.getDoctorByIdAndPsyId = async (doctorId, psychologistId) => {
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

module.exports.getDoctorById = async (doctorId) => {
  try {
    const doctor =  await knex(doctorsTable)
      .where("id", doctorId)
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

module.exports.checkDoctorIdExistForPsyId = async function checkDoctorIdExistForPsyId(doctorId, psychologistId) {
  const doctor = await this.getDoctorByIdAndPsyId(doctorId, psychologistId);

  if( doctor ) {
    return true;
  } else {
    console.error(`Doctor ID ${doctorId} does not exists for psy ID ${psychologistId}`);
    return false;
  }
}

module.exports.checkDoctorIdExist = async function checkDoctorIdExist(doctorId) {
  const doctor = await this.getDoctorById(doctorId);

  if( doctor ) {
    return true;
  } else {
    console.error(`Doctor ID ${doctorId} does not exists`);
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
    console.log("Creating one doctor in city", city)
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

module.exports.updateDoctor = async function updateDoctor (id, psychologistId, firstNames, lastName,
  address, city, postalCode, phone) {

  try {
    // @TODO not called at everytime in test, why?, await pb ?
    console.log("called updateDoctor")
    console.log("called updateDoctor")
    console.log("called updateDoctor")
    console.log("called updateDoctor")
    console.log("called updateDoctor")
    const now = date.getDateNowPG();

    return await knex(doctorsTable)
      .where("id", id)
      .where("psychologistId", psychologistId)
      .update({
        firstNames,
        lastName,
        address,
        city,
        postalCode,
        phone,
        updatedAt: now
      })
  } catch (err) {
    console.error("Erreur de modification du medecin", err)
    throw new Error("Erreur de modification du medecin")
  }
}
