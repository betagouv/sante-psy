/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema.table('psychologists', (table) => {
    table.boolean('isConventionSigned');
  });
};

exports.down = function (knex) {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('isConventionSigned');
  });
};
