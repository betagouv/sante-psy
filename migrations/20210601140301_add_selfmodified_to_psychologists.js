exports.up = function (knex) {
  return knex.schema.table('psychologists', (table) => {
    table.boolean('selfModified').defaultTo(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('selfModified');
  });
};
