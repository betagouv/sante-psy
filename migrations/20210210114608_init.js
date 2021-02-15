
exports.up = function up(knex) {
  return knex.schema
  .createTable('appointments', (table) => {
    table.datetime('date').notNullable().defaultTo(knex.fn.now());
  })
};

exports.down = function down(knex) {
  return knex.schema
    .dropTable('appointments')
};
