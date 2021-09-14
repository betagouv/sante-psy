import { Knex } from 'knex';
import loginInformations from '../services/loginInformations';

export async function up(knex: Knex): Promise<void> {
  await knex.schema
    .createTable('inactive_token', (table) => {
      table.text('token').primary();
      table.uuid('id').notNullable();
      table.boolean('confirm').defaultTo(false);
    });

  const psychologists = await knex('psychologists');
  return psychologists.length > 0
    ? knex('inactive_token').insert(psychologists.map((psy) => ({
      id: psy.dossierNumber,
      token: loginInformations.generateToken(32),
    })))
    : Promise.resolve();
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('inactive_token');
}
