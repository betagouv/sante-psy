/* eslint-disable func-names */
const dbPatients = require('../db/patients');

exports.up = function (knex) {
  return knex.schema.table(dbPatients.patientsTable, (table) => {
    table.text('institutionName');
    table.boolean('isStudentStatusVerified').defaultTo(false);
    table.boolean('hasPrescription').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table(dbPatients.patientsTable, (table) => {
    table.dropColumn('institutionName');
    table.dropColumn('isStudentStatusVerified');
    table.dropColumn('hasPrescription');
  });
};
