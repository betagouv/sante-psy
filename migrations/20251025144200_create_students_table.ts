import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('students', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('firstNames').notNullable();
    table.string('email').notNullable().unique();
    table.string('ine').notNullable().unique();
    table.boolean('validated').notNullable().defaultTo(false);
    table.timestamp('createdAt').notNullable().defaultTo(knex.fn.now());
    table.timestamp('updatedAt').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('students');
}
