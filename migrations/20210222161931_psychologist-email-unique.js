
const dbPsychologists = require("../db/psychologists")
/* eslint-disable func-names */

/**
 * worst case where 2 users enter the same email - force unique for emails
 * 
 */
exports.up = function(knex) {
  return knex.schema.alterTable(dbPsychologists.psychologistsTable, function(t) {
    t.unique('email')
  })
};

exports.down = function (knex) {
  return knex.schema.alterTable(dbPsychologists.psychologistsTable, function(t) {
    t.dropUnique('email')
  });
};