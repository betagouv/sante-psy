/* eslint-disable func-names */
const dbDoctors = require("../db/doctors");
const dbPatients = require("../db/patients");

exports.up = function (knex) {
  console.log(`Creating ${dbDoctors.doctorsTable} table`)
  return knex.schema
    .createTable(dbDoctors.doctorsTable, (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.text('firstNames').notNullable()
      table.text('lastName').notNullable()
      table.uuid('psychologistId').notNullable();
      table.text('address')
      table.text('city')
      table.text('postalCode')
      table.string('phone')
      table.timestamp('createdAt').defaultTo(knex.fn.now())
      table.timestamp('updatedAt')
    }).then(() => {
      return knex.schema.table(dbPatients.patientsTable, function (table) {
        table.uuid('doctorId'). notNullable();
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTable(dbDoctors.doctorsTable)
    .then(() => {
      return knex.schema.table(dbPatients.patientsTable, function (table) {
        table.dropColumn('doctorId');
      });
    });
};