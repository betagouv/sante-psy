
/* eslint-disable func-names */
const dbUniversities = require('../db/universities')

exports.up = function (knex) {
  return knex.schema.table(dbUniversities.universitiesTable, function (table) {
    table.specificType('emailSSU', 'text[]')
    table.specificType('emailUniversity', 'text[]')
  })
}

exports.down = function (knex) {
  return knex.schema.table(dbUniversities.universitiesTable, function (table) {
    table.dropColumn('emailSSU');
    table.dropColumn('emailUniversity');
  })
};