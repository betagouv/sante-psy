/* eslint-disable func-names */
exports.up = function(knex) {
  return knex.schema
    .createTable('universities', (table) => {
      table.increments('id').primary() // todo uuid ?
      table.string('name', 255).notNullable()
      table.timestamps() //updated_at / created_at
    }).then(function() {
      return knex.schema.createTable('patients', (table) => {
        table.increments('id').primary() // todo uuid ?
        table.string('firstNames', 255).notNullable()
        table.string('lastName', 255).notNullable()
        table.string('INE', 11)
        table.string('otherStudentNumber', 255) // if INE cannot be found
        table.timestamps() //updated_at / created_at

        // Note : students may not have a university. Ex: BTS students
        table.integer('universityId').unsigned()
        table.foreign('universityId').references('id').inTable('universities')
      })
    }).then(function() {
      return knex.schema
        .createTable('psychologists', (table) => {
          table.increments('id').primary() // todo uuid ?
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

          table.integer('universityId').unsigned() // todo notNullable once we have universities
          table.foreign('universityId').references('id').inTable('universities')

          table.timestamps() //updated_at / created_at
        })
    }).then(function() {
      return knex.schema
        .createTable('appointments', (table) => {
          table.increments('id').primary() // todo uuid ?

          table.integer('patientId').unsigned().notNullable()
          table.foreign('patientId').references('id').inTable('patients')

          table.integer('psychologistId').unsigned()  // todo notNullable once we have psy accounts
          table.foreign('psychologistId').references('id').inTable('psychologists')

          table.datetime('date').notNullable().defaultTo(knex.fn.now())
          table.timestamps() //updated_at / created_at
        });
    });
  // todo : user account for accountant at university. Create a separate user table ?
};

exports.down = function(knex) {
  return knex.schema.dropTable('appointments')
    .then(function() {
      return knex.schema.dropTable('psychologists')
    }).then(function() {
      return knex.schema.dropTable('patients')
    }).then(function() {
      return knex.schema.dropTable('universities')
    });
};
