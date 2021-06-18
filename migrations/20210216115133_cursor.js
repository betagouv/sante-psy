exports.up = function (knex) {
  console.log(`Creating ${'ds_api_cursor'} table`);
  return knex.schema.createTable('ds_api_cursor', (table) => {
    table.integer('id').primary(); // unique
    table.text('cursor');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('ds_api_cursor');
};
