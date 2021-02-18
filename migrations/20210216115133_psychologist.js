/* eslint-disable func-names */
const db = require("../utils/db")

exports.up = function (knex) {
  console.log(`Creating ${db.psychologists} table`);

  return knex.schema
    .createTable(db.psychologists, (table) => {
      table.uuid('dossierNumber').primary(); // to avoid duplicate when doing upsert
      table.text('email');
      table.text('name').notNullable()
      table.text('address'),
      table.text('departement'),
      table.text('region'),
      table.text('phone'),
      table.text('website'),
      table.boolean('teleconsultation'),
      table.text('description')
      table.text('adeli');
      table.json('training'); // Formations et expériences
      table.text('diploma');
      table.text('languages');
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt');
    });
};

exports.down = function (knex) {
  return knex.schema.dropTable(db.psychologists);
};
