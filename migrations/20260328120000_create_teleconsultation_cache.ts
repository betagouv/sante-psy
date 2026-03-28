import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('teleconsultation_cache', (table) => {
    table.increments('id');
    table.string('psychologistId').notNullable();
    table.string('psychologistName').notNullable();
    table.string('doctolibUrl').notNullable();
    table.timestamp('nextSlot').nullable();
    table.timestamp('lastSlotCheckedAt').nullable();
    table.timestamp('lastFullRefreshAt').nullable();
    table.timestamps(true, true);
    table.index(['nextSlot']);
    table.index(['lastFullRefreshAt']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('teleconsultation_cache');
}
