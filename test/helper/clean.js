const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig);
const dbPsychologists = require('../../db/psychologists');
const dbPatients = require('../../db/patients');
const dbAppointments = require('../../db/appointments');
const dbDsApiCursor = require('../../db/dsApiCursor');
const dbLoginToken = require('../../db/loginToken');
const uuid = require('../../utils/uuid');

module.exports.getRandomInt = function getRandomInt() {
  const min = Math.ceil(1);
  const max = Math.floor(99);
  const ourRandom = Math.floor(Math.random() * (max - min) + min);
  if (ourRandom < 10) {
    return `0${ourRandom.toString()}`;
  }
  return ourRandom.toString();
};

module.exports.getOnePsy = function getOnePsy(personalEmail = 'loginemail@beta.gouv.fr',
  state = 'accepte', archived = false, uniId = null) {
  const dossierNumber = uuid.randomUuid();
  return {
    dossierNumber,
    firstNames: `${module.exports.getRandomInt()}First`,
    lastName: `${module.exports.getRandomInt()}Last`,
    archived,
    state,
    adeli: `${module.exports.getRandomInt()}829302942`,
    address: `${module.exports.getRandomInt()} SOLA 66110 MONTBOLO`,
    diploma: 'Psychologie clinique de la santé',
    phone: '0468396600',
    email: `${module.exports.getRandomInt()}@beta.gouv.fr`,
    personalEmail,
    website: `${module.exports.getRandomInt()}beta.gouv.fr`,
    teleconsultation: Math.random() < 0.5,
    description: 'description',
    // eslint-disable-next-line max-len
    training: '["Connaissance et pratique des outils diagnostic psychologique","Connaissance des troubles psychopathologiques du jeune adulte : dépressions","risques suicidaires","addictions","comportements à risque","troubles alimentaires","décompensation schizophrénique","psychoses émergeantes ainsi qu’une pratique de leur repérage","Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)"]',
    departement: `${module.exports.getRandomInt()} - Calvados`,
    university: `${module.exports.getRandomInt()} Université`,
    declaredUniversityId: null, // not useful after script/matchPsychologistsToUniversities.js was used
    assignedUniversityId: uniId,
    region: 'Normandie',
    languages: 'Français ,Anglais, et Espagnol',
  };
};

module.exports.getOnePatient = function getOnePatient(psychologistId,
  doctorName = 'doctorName',
  useDateOfBirth = true) {
  let dateOfBirth = null;
  if (useDateOfBirth) {
    dateOfBirth = new Date(1980, 1, 10).toISOString();
  }
  return {
    id: uuid.randomUuid(),
    firstNames: `${module.exports.getRandomInt()}First`,
    lastName: `${module.exports.getRandomInt()}Last`,
    INE: '11111111111',
    institutionName: `${module.exports.getRandomInt()} university`,
    isStudentStatusVerified: true,
    hasPrescription: true,
    psychologistId,
    doctorName,
    doctorAddress: 'doctorAddress',
    dateOfBirth,
  };
};

module.exports.getOneAppointment = function getOneAppointment(patientId, psychologistId, month = 3) {
  const myDate = new Date(2021, month, 10).toISOString();
  return {
    id: uuid.randomUuid(),
    psychologistId,
    appointmentDate: myDate,
    patientId,
  };
};

module.exports.psyList = function getPsyList(personalEmail = 'loginemail@beta.gouv.fr',
  state = 'accepte', archived = false) {
  const universityId = uuid.randomUuid();
  return [
    module.exports.getOnePsy(personalEmail, state, archived, universityId),
  ];
};

module.exports.cleanDataCursor = async function cleanDataCursor() {
  return knex(dbDsApiCursor.dsApiCursorTable).select('*').delete();
};

module.exports.cleanDataAppointments = async function cleanDataAppointments() {
  return knex(dbAppointments.appointmentsTable).select('*').delete();
};

module.exports.cleanDataToken = async function cleanDataToken() {
  return knex(dbLoginToken.loginTokenTable).select('*').delete();
};

module.exports.cleanAllPsychologists = async function cleanAllPsychologists() {
  try {
    return knex(dbPsychologists.psychologistsTable).select('*').delete();
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

module.exports.cleanAllPatients = function cleanAllPatients() {
  return knex(dbPatients.patientsTable).select('*').delete();
};

module.exports.cleanAllAppointments = function cleanAllAppointments() {
  return knex('appointments').select('*').delete();
};

module.exports.cleanAllUniversities = function cleanAllUniversities() {
  return knex('universities').select('*').delete();
};
