import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('patients', (table) => {
    table.string('email').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('patients', (table) => {
    table.dropColumn('email');
  });
}
