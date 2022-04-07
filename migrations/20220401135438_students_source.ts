import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('students', (table) => {
    table.text('source');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('students', (table) => {
    table.dropColumn('source');
  });
}
