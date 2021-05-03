/* eslint-disable func-names */
const dbPsychologists = require('../db/psychologists');

/**
 *
 * to be able to remove psychologist that has been revoked we need to store their state and
 * their archive status
 * @param {*} knex 
 */
exports.up = function (knex) {
  return knex.schema.alterTable(dbPsychologists.psychologistsTable, (table) => {
    table.text('diploma').alter(); // some people typed in looong diploma name
  }).then(() => knex.schema.table(dbPsychologists.psychologistsTable, (table) => {
    table.boolean('archived');
    table.text('state');
  }));
};

exports.down = function (knex) {
  return knex.schema.alterTable(dbPsychologists.psychologistsTable, (table) => {
    table.string('diploma').alter();
  }).then(() => knex.schema.table(dbPsychologists.psychologistsTable, (table) => {
    table.dropColumn('archived');
    table.dropColumn('state');
  }));
};
