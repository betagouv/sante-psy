/* eslint-disable func-names */
const dbUniversities = require('../db/universities');

exports.up = function (knex) {
  return knex.schema.table(dbUniversities.universitiesTable, (table) => {
    table.text('emailSSU');
    table.text('emailUniversity');
  });
};

exports.down = function (knex) {
  return knex.schema.table(dbUniversities.universitiesTable, (table) => {
    table.dropColumn('emailSSU');
    table.dropColumn('emailUniversity');
  });
};
