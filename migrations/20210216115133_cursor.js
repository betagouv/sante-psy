/* eslint-disable func-names */
const db = require("../utils/db")

exports.up = function (knex) {
  console.log(`Creating ${db.dsApiCursor} table`);
  return knex.schema.createTable(db.dsApiCursor, (table) => {
    table.integer('id').primary(); //unique
    table.text('cursor');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(db.dsApiCursor);
};
