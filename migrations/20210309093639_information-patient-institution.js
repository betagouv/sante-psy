/* eslint-disable func-names */
const dbPatients = require('../db/patients')

exports.up = function(knex) {
  return knex.schema.table(dbPatients.patientsTable, function (table) {
    table.string('institutionName');
    table.boolean('hasJustification');
    table.boolean('hasPrescription');
  })
};

exports.down = function(knex) {
  return knex.schema.table(dbPatients.patientsTable, function (table) {
    table.dropColumn('institutionName');
    table.dropColumn('hasJustification');
    table.dropColumn('hasPrescription');
  })
};
