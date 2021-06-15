/* eslint-disable func-names */
exports.up = function (knex) {
  return knex.schema
    .createTable('login_token', (table) => {
      table.text('token').primary();
      table.text('email').notNullable();
      table.datetime('createdAt').notNullable().defaultTo(knex.fn.now());
      table.datetime('expiresAt').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable('login_token');
};
