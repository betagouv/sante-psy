
const dbPsychologists = require('../db/psychologists')

exports.up = function (knex) {
  return knex.schema.table(dbPsychologists.psychologistsTable, function (table) {
    table.text('emailLogin').notNullable();
  })
}

exports.down = function (knex) {
  return knex.schema.table(dbPsychologists.psychologistsTable, function (table) {
    table.dropColumn('emailLogin');
  })
};