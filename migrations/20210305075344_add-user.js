
exports.up = function (knex) {
  return knex.schema
    .createTable('users', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.text('email').notNullable();
      table.unique('email')
      table.uuid('psychologistId').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('users');
};