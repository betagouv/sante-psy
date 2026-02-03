import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('students', (table) => {
    table.text('lastName').notNullable();
    table.date('dateOfBirth').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('students', (table) => {
    table.dropColumn('lastName');
    table.dropColumn('dateOfBirth');
  });
}
