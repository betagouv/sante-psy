
/* eslint-disable func-names */
const dbUniversities = require('../db/universities')

exports.up = function (knex) {
  return knex.schema.table(dbUniversities.universitiesTable, function (table) {
    table.text('email')
  })
}

exports.down = function (knex) {
  return knex.schema.table(dbUniversities.universitiesTable, function (table) {
    table.dropColumn('email');
  })
};