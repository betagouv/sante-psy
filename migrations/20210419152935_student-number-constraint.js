/* eslint-disable func-names */
const dbPatients = require("../db/patients")

/**
 * some students number can be different than 11 chars
 * @param {*} knex 
 */
exports.up = function(knex) {
  return knex.schema.alterTable(dbPatients.patientsTable, function(table) {
    table.string('INE', dbPatients.studentNumberSize).alter();
  });
}

exports.down = function(knex) {
  return knex.schema.alterTable(dbPatients.patientsTable, function(table) {
    table.string('INE', 11).alter();
  });
};
