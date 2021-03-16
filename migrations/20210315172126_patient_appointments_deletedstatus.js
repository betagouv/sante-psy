/* eslint-disable func-names */
const dbPatients = require('../db/patients')
const dbAppointments = require("../db/appointments")

exports.up = function(knex) {
  return knex.schema.table(dbPatients.patientsTable, function (table) {
    table.boolean('deleted').defaultTo(false)
  }).then(() => {
    return knex.schema.table(dbAppointments.appointmentsTable, function (table) {
      table.boolean('deleted').defaultTo(false)
    });
  });
};

exports.down = function(knex) {
  return knex.schema.table(dbPatients.patientsTable, function (table) {
    table.dropColumn('deleted');
  }).then(() => {
    return knex.schema.table(dbAppointments.appointmentsTable, function (table) {
      table.dropColumn('deleted');
    });
  });
};
