import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('login_token', 'psychologists_login_token');

  await knex.raw('ALTER INDEX login_token_pkey RENAME TO psychologists_login_token_pkey;');
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('ALTER INDEX psychologists_login_token_pkey RENAME TO login_token_pkey;');

  await knex.schema.renameTable('psychologists_login_token', 'login_token');
}
