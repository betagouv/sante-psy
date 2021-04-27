const { psychologistsTable } = require('../db/psychologists')

exports.up = function (knex) {
  return knex.schema.table(psychologistsTable, function (table) {
    table.uuid('assignedUniversityId');
    table.renameColumn('payingUniversityId', 'declaredUniversityId')
  })
}

exports.down = function (knex) {
  return knex.schema.table(psychologistsTable, function (table) {
    table.dropColumn('assignedUniversityId');
    table.renameColumn('declaredUniversityId', 'payingUniversityId')
  })
};