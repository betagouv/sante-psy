/* eslint-disable func-names */
/* up and down are unnamed funcs, it's the generated knex format. */

exports.up = function(knex) {
  // Create the new column with a default value
  // (so that existing rows can have a value in the new column)
  return knex.schema.table('appointments', function (table) {
    table.text('patientName').notNullable().defaultTo('< NOM VIDE >');
  }).then(() => {
    // Set the column to notNullable now that all rows have values.
    return knex.schema.alterTable('appointments', (table) => {
      table.text('patientName').notNullable().alter();
    });
  })
};

exports.down = function(knex) {
  return knex.schema.table('appointments', function (table) {
    table.dropColumn('patientName');
  })
};
