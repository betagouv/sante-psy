/* eslint-disable func-names */
const db = require("../utils/db")

exports.up = function (knex) {
  console.log(`Creating ${db.psychologists} table`);

  return knex.schema
    .createTable(db.psychologists, (table) => {
      // email must be used as primary when updating all psychologists from DS to not have duplicate
      table.text('email').primary();
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
