const knexConfig = require("../../knexfile");
const knex = require("knex")(knexConfig);
const dbPsychologists = require('../../db/psychologists')
const dbPatients = require('../../db/patients')
const dbAppointments = require('../../db/appointments')
const dbDsApiCursor = require('../../db/dsApiCursor')
const dbLoginToken = require('../../db/loginToken')
const date = require('../../utils/date');
const uuid = require('../../utils/uuid');



module.exports.testDossierNumber = function getTestDossierNumber(random = Math.random().toString()) {
  return uuid.generateUuidFromString(random);
}

module.exports.getRandomInt = function getRandomInt() {
  const min = Math.ceil(1);
  const max = Math.floor(99);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

module.exports.getOnePsy = function getOnePsy(personalEmail = 'loginemail@beta.gouv.fr',
  state = 'accepte', archived = false) {
  const dossierNumber = module.exports.testDossierNumber(Math.random().toString())
  return {
    dossierNumber: dossierNumber,
    firstNames: `${module.exports.getRandomInt()}First`,
    lastName: `${module.exports.getRandomInt()}Last`,
    archived : archived,
    state : state,
    adeli: `${module.exports.getRandomInt()}829302942`,
    address: `${module.exports.getRandomInt()} SOLA 66110 MONTBOLO`,
    diploma: "Psychologie clinique de la santé",
    phone: '0468396600',
    email: `${module.exports.getRandomInt()}@beta.gouv.fr`,
    personalEmail: personalEmail,
    website: `${module.exports.getRandomInt()}beta.gouv.fr`,
    teleconsultation: Math.random() < 0.5,
    description: "description",
    // eslint-disable-next-line max-len
    training: "[\"Connaissance et pratique des outils diagnostic psychologique\",\"Connaissance des troubles psychopathologiques du jeune adulte : dépressions\",\"risques suicidaires\",\"addictions\",\"comportements à risque\",\"troubles alimentaires\",\"décompensation schizophrénique\",\"psychoses émergeantes ainsi qu’une pratique de leur repérage\",\"Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)\"]",
    departement: `${module.exports.getRandomInt()} - Calvados`,
    region: "Normandie",
    languages: "Français ,Anglais, et Espagnol"
  };
}

module.exports.getOnePatient = function getOnePatient(psychologistId) {
  return {
    id: module.exports.testDossierNumber(Math.random().toString()),
    firstNames:`${module.exports.getRandomInt()}First`,
    lastName:`${module.exports.getRandomInt()}Last`,
    INE:"11111111111",
    institutionName:`${module.exports.getRandomInt()} university`,
    isStudentStatusVerified:true,
    hasPrescription:true,
    psychologistId:psychologistId,
    doctorName:"doctorName",
    doctorAddress:"doctorAddress",
    doctorPhone:"doctorPhone",
  };
}

module.exports.getOneAppointment = function getOneAppointment(patientId, psychologistId) {
  const now = date.getDateNowPG();
  return {
    id: module.exports.testDossierNumber(Math.random().toString()),
    psychologistId: psychologistId,
    appointmentDate: now,
    patientId: patientId,
  };
}

module.exports.psyList = function getPsyList(personalEmail = 'loginemail@beta.gouv.fr',
  state = 'accepte', archived = false) {
  return [
    module.exports.getOnePsy(personalEmail, state, archived)
  ];
}

module.exports.cleanDataCursor = async function cleanDataCursor() {
  return knex(dbDsApiCursor.dsApiCursorTable).select('*').delete();
}

module.exports.cleanDataAppointments = async function cleanDataAppointments() {
  return knex(dbAppointments.appointmentsTable).select('*').delete();
}

module.exports.cleanDataToken = async function cleanDataToken() {
  return knex(dbLoginToken.loginTokenTable).select('*').delete();
}

module.exports.cleanAllPsychologists = async function cleanAllPsychologists() {
  try {
    return knex(dbPsychologists.psychologistsTable).select('*').delete()
  } catch (err) {
    console.log(err);
  }
}

module.exports.cleanAllPatients = function cleanAllPatients() {
  return knex(dbPatients.patientsTable).select('*').delete()
}

module.exports.cleanAllAppointments = function cleanAllAppointments() {
  return knex('appointments').select('*').delete()
}
