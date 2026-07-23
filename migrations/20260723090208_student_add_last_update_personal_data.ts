import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('students', (table) => {
    table.date('last_update_personal_data').defaultTo(knex.fn.now()).nullable();
  });
  await knex('students').update({
    last_update_personal_data: '2026-01-01',
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('students', (table) => {
    table.dropColumn('last_update_personal_data');
  });
}
