
/* eslint-disable func-names */
const dbPsychologists = require("../db/psychologists")

/**
 *
 * to be able to remove psychologist that has been revoked we need to store their state and
 * their archive status
 * @param {*} knex 
 */
exports.up = function(knex) {
  return knex.schema.alterTable(dbPsychologists.psychologistsTable, function(table) {
    table.text('diploma').alter(); // some people typed in looong diploma name
  }).then(() => {
    return knex.schema.table(dbPsychologists.psychologistsTable, function (table) {
      table.boolean('archived');
      table.text('state');
    });
  });
}

exports.down = function(knex) {
  return knex.schema.alterTable(dbPsychologists.psychologistsTable, function(table) {
    table.string('diploma').alter();
  }).then(() => {
    return knex.schema.table(dbPsychologists.psychologistsTable, function (table) {
      table.dropColumn('archived');
      table.dropColumn('state');
    })
  });


};
