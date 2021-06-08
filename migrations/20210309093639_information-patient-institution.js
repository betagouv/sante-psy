/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.table('patients', (table) => {
    table.text('institutionName');
    table.boolean('isStudentStatusVerified').defaultTo(false);
    table.boolean('hasPrescription').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table('patients', (table) => {
    table.dropColumn('institutionName');
    table.dropColumn('isStudentStatusVerified');
    table.dropColumn('hasPrescription');
  });
};
