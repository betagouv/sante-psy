import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('last_connections', (table) => {
    table.uuid('psychologistId')
          .primary()
          .references('dossierNumber')
          .inTable('psychologists');
    table.dateTime('at');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('last_connections');
}
