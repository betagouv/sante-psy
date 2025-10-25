import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.renameTable('students', 'students_newsletter');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.renameTable('students_newsletter', 'students');
}
