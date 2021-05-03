/* eslint-disable func-names */
const dbPatients = require('../db/patients');
const dbAppointments = require('../db/appointments');

exports.up = function (knex) {
  return knex.schema.table(dbPatients.patientsTable, (table) => {
    table.boolean('deleted').defaultTo(false);
  }).then(() => knex.schema.table(dbAppointments.appointmentsTable, (table) => {
    table.boolean('deleted').defaultTo(false);
  }));
};

exports.down = function (knex) {
  return knex.schema.table(dbPatients.patientsTable, (table) => {
    table.dropColumn('deleted');
  }).then(() => knex.schema.table(dbAppointments.appointmentsTable, (table) => {
    table.dropColumn('deleted');
  }));
};
