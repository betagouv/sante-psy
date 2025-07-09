import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('psychologists', (table) => {
    table.text('description').alter();
    table.text('website').alter();
    table.text('appointmentLink').alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('psychologists', (table) => {
    table.string('description', 255).alter();
    table.string('website', 255).alter();
    table.string('appointmentLink', 255).alter();
  });
}
