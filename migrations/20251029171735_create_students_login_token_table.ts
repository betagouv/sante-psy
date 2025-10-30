import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('students_login_token', (table) => {
    table.text('token').primary();
    table.text('email').notNullable();
    table.datetime('createdAt').notNullable().defaultTo(knex.fn.now());
    table.datetime('expiresAt').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('students_login_token');
}
