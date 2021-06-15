/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.table('psychologists', (table) => {
    table.text('personalEmail').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('personalEmail');
  });
};
