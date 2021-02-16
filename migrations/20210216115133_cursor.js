/* eslint-disable func-names */
const dsApiCursor = "ds_api_cursor";

exports.up = function(knex) {
  console.log(`Creating ${dsApiCursor} table`);
  // Set the column to notNullable now that all rows have values.
  return knex.schema.createTable(dsApiCursor, (table) => {
    table.increments();
    table.text('cursor');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable(dsApiCursor);
};
