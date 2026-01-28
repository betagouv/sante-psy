import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('login_token', (table) => {
    // Add role column with default value 'psy' for existing records
    // Since students don't exist yet in production, all existing tokens are for psychologists
    table.string('role').notNullable().defaultTo('psy');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('login_token', (table) => {
    table.dropColumn('role');
  });
}
