import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('students', (table) => {
    table.boolean('api_ines_check').nullable().defaultTo(null);
  });

  await knex('students').update({
    api_ines_check: null,
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('students', (table) => {
    table.dropColumn('api_ines_check');
  });
}
