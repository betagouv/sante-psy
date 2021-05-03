/* eslint-disable func-names */
const dbAppointments = require('../db/appointments');

/**
 * to join appointments.psychologistId with psychologists.id
 * @param {*} knex 
 */
exports.up = function (knex) {
  return knex.schema.alterTable(dbAppointments.appointmentsTable, (table) => {
    table.uuid('psychologistId').alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable(dbAppointments.appointmentsTable, (table) => {
    table.string('psychologistId').alter();
  });
};
