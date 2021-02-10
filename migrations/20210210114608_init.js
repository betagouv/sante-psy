
exports.up = function(knex) {
  return knex.schema
  .createTable('appointment', (table) => {
    table.datetime('date').notNullable().defaultTo(knex.fn.now());
  })
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('appointment')
};
