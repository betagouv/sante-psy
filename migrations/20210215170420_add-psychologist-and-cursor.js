/* eslint-disable func-names */
/* up and down are unnamed funcs, it's the generated knex format. */
// http://knexjs.org/#Schema-createTable
//  https://devhints.io/knex#schema
const psychologistsTable = "psychologists";
const dsApiCursor = "ds_api_cursor";

exports.up = function(knex) {
  console.log(`Creating ${psychologistsTable} table`);

  return knex.schema
  .createTable(psychologistsTable, (table) => {
    table.text('email').primary()
    table.string('name').notNullable()
    table.string('address'),
    table.string('county'),
    table.string('region'),
    table.string('phone'),
    table.string('website'),
    table.boolean('teleconsultation'),
    table.text('description')
    table.string('adeli')
    table.json('training') // Formations et expériences
    table.string('diploma')
    table.string('university')
    table.timestamps(); //updated_at / created_at
  }).then(() => {
    console.log(`Creating ${dsApiCursor} table`);
    // Set the column to notNullable now that all rows have values.
    knex.schema.createTable(dsApiCursor, (table) => {
      table.increments();
      table.text('cursor').primary()
      table.timestamps(); //updated_at / created_at
    });
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable(psychologistsTable)
  .then(() => {
    return knex.schema.dropTable(dsApiCursor);
  });
};
