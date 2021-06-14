exports.up = function (knex) {
  return knex.schema.table('psychologists', (table) => {
    table.boolean('active').notNullable().defaultTo(true);
    table.datetime('inactiveUntil');
  });
};

exports.down = function (knex) {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('active');
    table.dropColumn('inactiveUntil');
  });
};
