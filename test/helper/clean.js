const knexConfig = require("../../knexfile");
const knex = require("knex")(knexConfig);
const dbPsychologists = require('../../db/psychologists')
const dbPatients = require('../../db/patients')
const dbDsApiCursor = require('../../db/dsApiCursor')
const dbLoginToken = require('../../db/loginToken')
const rewire = require("rewire");
const demarchesSimplifiees = rewire('../../utils/demarchesSimplifiees');



module.exports.testDossierNumber = function getTestDossierNumber() {
  const getUuidDossierNumber = demarchesSimplifiees.__get__('getUuidDossierNumber');
  return getUuidDossierNumber(1);
}

module.exports.psyList = function getPsyList() {
  return [
    {
      dossierNumber: module.exports.testDossierNumber(),
      firstNames: 'First second',
      lastName: 'Last',
      archived : false,
      state : 'accepte',
      adeli: "829302942",
      address: 'SSR CL AL SOLA 66110 MONTBOLO',
      diploma: "Psychologie clinique de la santé",
      phone: '0468396600',
      email: 'psychologue.test@beta.gouv.fr',
      personalEmail: 'loginemail@beta.gouv.fr',
      website: 'apas82.mssante.fr',
      teleconsultation: true,
      description: "description",
      // eslint-disable-next-line max-len
      training: "[\"Connaissance et pratique des outils diagnostic psychologique\",\"Connaissance des troubles psychopathologiques du jeune adulte : dépressions\",\"risques suicidaires\",\"addictions\",\"comportements à risque\",\"troubles alimentaires\",\"décompensation schizophrénique\",\"psychoses émergeantes ainsi qu’une pratique de leur repérage\",\"Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)\"]",
      departement: "14 - Calvados",
      region: "Normandie",
      languages: "Français ,Anglais, et Espagnol"
    }];
}

module.exports.cleanDataCursor = async function cleanDataCursor() {
  return knex(dbDsApiCursor.dsApiCursorTable).select('*').delete();
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
