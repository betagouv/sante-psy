/* eslint-disable func-names */
const dbDsApiCursor = require("../db/dsApiCursor")

exports.up = function (knex) {
  console.log(`Creating ${dbDsApiCursor.dsApiCursorTable} table`);
  return knex.schema.createTable(dbDsApiCursor.dsApiCursorTable, (table) => {
    table.integer('id').primary(); //unique
    table.text('cursor');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(dbDsApiCursor.dsApiCursorTable);
};
