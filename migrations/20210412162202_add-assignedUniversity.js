const { psychologistsTable } = require('../db/psychologists')

exports.up = function (knex) {
  return knex.schema.table(psychologistsTable, function (table) {
    table.uuid('assignedUniversityId');
  })
}

exports.down = function (knex) {
  return knex.schema.table(psychologistsTable, function (table) {
    table.dropColumn('assignedUniversityId');
  })
};
