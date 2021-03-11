/* eslint-disable func-names */
const dbPatients = require('../db/patients')

exports.up = function(knex) {
  return knex.schema.table(dbPatients.patientsTable, function (table) {
    table.text('doctorName').notNullable()
    table.text('doctorAddress')
    table.string('doctorPhone')
  })
};

exports.down = function(knex) {
  return knex.schema.table(dbPatients.patientsTable, function (table) {
    table.dropColumn('doctorName');
    table.dropColumn('doctorAddress');
    table.dropColumn('doctorPhone');
  })
};
