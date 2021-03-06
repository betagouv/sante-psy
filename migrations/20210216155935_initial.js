exports.up = function (knex) {
  // Add extention for handling uuids to postgres
  return knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').then(() => {
    console.log('Creating universities table');

    return knex.schema
      .createTable('universities', (table) => {
        table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
        table.string('name', 255).notNullable();

        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt');
      });
  }).then(() => {
    console.log('Creating patients table');

    return knex.schema.createTable('patients', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.text('firstNames').notNullable();
      table.text('lastName').notNullable();
      table.string('INE', 11);
      table.string('otherStudentNumber', 255); // if INE cannot be found

      // Note : students may not have a university. Ex: BTS students
      table.uuid('universityId');

      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt');
    });
  }).then(() => {
    console.log('Creating psychologists table');

    return knex.schema
        .createTable('psychologists', (table) => {
          table.uuid('dossierNumber').primary(); // to avoid duplicate when doing upsert
          table.string('adeli').notNullable(); // all therapists should be registered and have a number
          table.text('firstNames').notNullable();
          table.text('lastName').notNullable();
          table.text('email').notNullable(); // this will be the login for the user
          table.text('address');
          table.string('departement');
          table.string('region');
          table.string('phone');
          table.string('website');
          table.boolean('teleconsultation');
          table.text('description');
          table.text('languages');
          table.json('training'); // Formations et expériences
          table.string('diploma');
          table.string('university');

          table.uuid('payingUniversityId');

          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt');
        });
  })
.then(() => {
  console.log('Creating appointments table');

  return knex.schema
        .createTable('appointments', (table) => {
          table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));

          table.uuid('patientId').notNullable();
          table.string('psychologistId');

          table.datetime('appointmentDate').notNullable().defaultTo(knex.fn.now());

          table.timestamp('createdAt').defaultTo(knex.fn.now());
          table.timestamp('updatedAt');
        });
});
  // todo : a doctor writes an "orientation" of the patient to a psychologist. Upload it, and optionally store
  // doctor's name. Also count the appointments done per orientation (3).
  // todo : accountant at university will need a user account. Create a separate user table ?
  // Some universities have SSU, so they will have an accountant account, others do not.
  // todo : doctor accounts, to follow the medical file of the patients.
};

exports.down = function (knex) {
  return knex.schema.dropTable('appointments')
    .then(() => knex.schema.dropTable('psychologists')).then(() => knex.schema.dropTable('patients')).then(() => knex.schema.dropTable('universities'))
.then(() => knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp";'));
};
