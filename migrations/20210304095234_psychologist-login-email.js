
/* eslint-disable func-names */
const dbPsychologists = require('../db/psychologists')

exports.up = function (knex) {
  return knex.schema.table(dbPsychologists.psychologistsTable, function (table) {
    table.text('personalEmail').notNullable();
  })
}

exports.down = function (knex) {
  return knex.schema.table(dbPsychologists.psychologistsTable, function (table) {
    table.dropColumn('personalEmail');
  })
};