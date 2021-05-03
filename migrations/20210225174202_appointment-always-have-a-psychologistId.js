/* eslint-disable func-names */

const dbAppointments = require('../db/appointments');

exports.up = function (knex) {
  return knex.schema
    .alterTable(dbAppointments.appointmentsTable, (table) => {
      table.string('psychologistId').notNullable().alter();
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable(dbAppointments.appointmentsTable, (table) => {
      table.string('psychologistId').nullable().alter();
    });
};
