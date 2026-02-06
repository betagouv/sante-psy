import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('login_token', (table) => {
    table
      .integer('signInAttempts')
      .notNullable()
      .defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('login_token', (table) => {
    table.dropColumn('signInAttempts');
  });
}
