/* eslint-disable func-names */
const psychologistsTable = "psychologists";

exports.up = function (knex) {
  console.log(`Creating ${psychologistsTable} table`);

  return knex.schema
    .createTable(psychologistsTable, (table) => {
      table.increments('id').primary();
      table.text('email');
      table.text('name').notNullable()
      table.text('address'),
      table.text('county'),
      table.text('region'),
      table.text('phone'),
      table.text('website'),
      table.boolean('teleconsultation'),
      table.text('description')
      table.text('adeli');
      table.json('training'); // Formations et expériences
      table.text('diploma');
      table.text('languages');
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable(psychologistsTable);
};
