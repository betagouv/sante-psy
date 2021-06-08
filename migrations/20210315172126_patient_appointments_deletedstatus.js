/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.table('patients', (table) => {
    table.boolean('deleted').defaultTo(false);
  }).then(() => knex.schema.table('appointments', (table) => {
    table.boolean('deleted').defaultTo(false);
  }));
};

exports.down = function (knex) {
  return knex.schema.table('patients', (table) => {
    table.dropColumn('deleted');
  }).then(() => knex.schema.table('appointments', (table) => {
    table.dropColumn('deleted');
  }));
};
