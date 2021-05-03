/* eslint-disable func-names */

const dbPsychologists = require('../db/psychologists');

exports.up = function (knex) {
  return knex.schema.table(dbPsychologists.psychologistsTable, (table) => {
    table.boolean('isConventionSigned');
  });
};

exports.down = function (knex) {
  return knex.schema.table(dbPsychologists.psychologistsTable, (table) => {
    table.dropColumn('isConventionSigned');
  });
};
