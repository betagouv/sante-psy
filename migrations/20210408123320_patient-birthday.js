/* eslint-disable func-names */

const dbPatients = require('../db/patients');

const columnBirthday = 'dateOfBirth';
exports.up = function (knex) {
  console.log(`Adding ${columnBirthday} column to ${dbPatients.patientsTable}`);
  return knex.schema.table(dbPatients.patientsTable, (table) => {
    table.datetime(columnBirthday);
  });
};

exports.down = function (knex) {
  return knex.schema.table(dbPatients.patientsTable, (table) => {
    table.dropColumn(columnBirthday);
  });
};
