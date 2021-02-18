/* eslint-disable func-names */
const db = require("../utils/db")

exports.up = function(knex) {
  console.log(`Creating ${db.ds_api_cursor} table`);
  // Set the column to notNullable now that all rows have values.
  return knex.schema.createTable(db.ds_api_cursor, (table) => {
    table.integer('id').primary(); //unique
    table.text('cursor');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(db.ds_api_cursor);
};
