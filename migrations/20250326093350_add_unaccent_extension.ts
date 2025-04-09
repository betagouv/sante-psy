import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw('CREATE EXTENSION IF NOT EXISTS unaccent;');
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw('DROP EXTENSION IF EXISTS unaccent;');
}
