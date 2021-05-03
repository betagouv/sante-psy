/* eslint-disable func-names */
const dbPatients = require('../db/patients');

exports.up = function (knex) {
  return knex.schema.table(dbPatients.patientsTable, (table) => {
    table.text('doctorName');
    table.text('doctorAddress');
    table.string('doctorPhone');
  });
};

exports.down = function (knex) {
  return knex.schema.table(dbPatients.patientsTable, (table) => {
    table.dropColumn('doctorName');
    table.dropColumn('doctorAddress');
    table.dropColumn('doctorPhone');
  });
};
