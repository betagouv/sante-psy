import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Supprime l'ancienne table (un seul next_slot par psy)
  if (await knex.schema.hasTable('teleconsultation_cache')) {
    await knex.schema.dropTable('teleconsultation_cache');
  }

  // Nouvelle table : un créneau par ligne, liste plate triée par date
  await knex.schema.createTable('teleconsultation_slots', (table) => {
    table.increments('id');
    table.string('psychologistId').notNullable();
    table.string('psychologistName').notNullable();
    table.string('doctolibUrl').notNullable();
    table.timestamp('slotDatetime').notNullable();
    table.timestamp('lastFullRefreshAt').nullable();
    table.timestamps(true, true);
    table.index(['slotDatetime']);
    table.index(['psychologistId']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('teleconsultation_slots');

  // Recrée l'ancienne table
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
