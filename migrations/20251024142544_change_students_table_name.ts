/* eslint-disable max-len */
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('students', 'students_newsletter');

  await knex.raw('ALTER INDEX students_pkey RENAME TO students_newsletter_pkey;');
  await knex.raw('ALTER TABLE students_newsletter RENAME CONSTRAINT students_email_unique TO students_newsletter_email_unique;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('ALTER TABLE students_newsletter RENAME CONSTRAINT students_newsletter_email_unique TO students_email_unique;');
  await knex.raw('ALTER INDEX students_newsletter_pkey RENAME TO students_pkey;');

  await knex.schema.renameTable('students_newsletter', 'students');
}
