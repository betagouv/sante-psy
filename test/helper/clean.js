const knexConfig = require("../../knexfile");
const knex = require("knex")(knexConfig);
const dbPsychologists = require('../../db/psychologists')
const dbPatients = require('../../db/patients')
const dbDsApiCursor = require('../../db/dsApiCursor')
const dbLoginToken = require('../../db/loginToken')

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
