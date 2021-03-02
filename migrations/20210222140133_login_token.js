/* eslint-disable func-names */
const dbLoginToken = require("../db/loginToken")

exports.up = function (knex) {
  return knex.schema
    .createTable(dbLoginToken.loginTokenTable, (table) => {
      table.text('token').primary();
      table.text('email').notNullable();
      table.datetime('createdAt').notNullable().defaultTo(knex.fn.now());
      table.datetime('expiresAt').notNullable();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable(dbLoginToken.loginTokenTable);
};