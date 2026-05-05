import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('last_connections_students', (table) => {
    table.uuid('student_id').primary().references('id').inTable('students');
    table.dateTime('at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('last_connections_students');
}
