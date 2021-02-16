/* eslint-disable func-names */
const psychologistsTable = "psychologists";

exports.up = function(knex) {
  console.log(`Creating ${psychologistsTable} table`);

  return knex.schema
    .createTable(psychologistsTable, (table) => {
      table.increments('id').primary();
      table.text('email');
      table.string('name').notNullable()
      table.string('address'),
      table.string('county'),
      table.string('region'),
      table.string('phone'),
      table.string('website'),
      table.boolean('teleconsultation'),
      table.text('description')
      table.string('adeli');
      table.json('training') // Formations et expériences
      table.string('diploma')
      table.string('university')
      table.timestamps(); //updated_at / created_at
    });
};

exports.down = function(knex) {
  return knex.schema.dropTable(psychologistsTable);
};
