/* eslint-disable func-names */
exports.up = function(knex) {
  // Add extention for handling uuids to postgres
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').then(function() {
    return knex.schema
      .createTable('universities', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
        table.string('name', 255).notNullable()
        table.timestamps() //updated_at / created_at
      })
  }).then(function() {
    return knex.schema.createTable('patients', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('firstNames', 255).notNullable()
      table.string('lastName', 255).notNullable()
      table.string('INE', 11)
      table.string('otherStudentNumber', 255) // if INE cannot be found
      table.timestamps() //updated_at / created_at

      // Note : students may not have a university. Ex: BTS students
      table.uuid('universityId')
      table.foreign('universityId').references('id').inTable('universities')
    })
  }).then(function() {
    return knex.schema
        .createTable('psychologists', (table) => {
          table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))
          table.string('adeli').notNullable()
          table.string('firstNames', 255).notNullable()
          table.string('lastName', 255).notNullable()
          table.text('email') // todo will this be a login ?
          table.string('address')
          table.string('county')
          table.string('region')
          table.string('phone')
          table.string('website')
          table.boolean('teleconsultation')
          table.text('description')
          table.json('training') // Formations et expériences
          table.string('diploma')
          table.string('university')
          table.timestamps() //updated_at / created_at

          table.uuid('universityId') // todo notNullable once we have universities
          table.foreign('universityId').references('id').inTable('universities')
        })
  }).then(function() {
    return knex.schema
        .createTable('appointments', (table) => {
          table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'))

          table.uuid('patientId').notNullable()
          table.foreign('patientId').references('id').inTable('patients')

          table.uuid('psychologistId').unsigned()  // todo notNullable once we have psy accounts
          table.foreign('psychologistId').references('id').inTable('psychologists')

          table.datetime('date').notNullable().defaultTo(knex.fn.now())
          table.timestamps() //updated_at / created_at
        });
  });
  // todo : a doctor writes an "orientation" of the patient to a psychologist. Upload it, and optionally store
  // doctor's name. Also count the appointments done per orientation (3).
  // todo : accountant at university will need a user account. Create a separate user table ?
  // Some universities have SSU, so they will have an accountant account, others do not.
  // todo : doctor accounts, to follow the medical file of the patients.
};

exports.down = function(knex) {
  return knex.schema.dropTable('appointments')
    .then(function() {
      return knex.schema.dropTable('psychologists')
    }).then(function() {
      return knex.schema.dropTable('patients')
    }).then(function() {
      return knex.schema.dropTable('universities')
    }).then(function() {
      return knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp";')
    })
};
