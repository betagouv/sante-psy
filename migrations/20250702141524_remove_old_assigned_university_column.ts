import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Supprimer l'ancienne colonne assignedUniversityId de la table psychologists
  return knex.schema.alterTable('psychologists', (table) => {
    table.dropColumn('assignedUniversityId');
  });
}

export async function down(knex: Knex): Promise<void> {
  // Remettre la colonne en cas de rollback
  return knex.schema.alterTable('psychologists', (table) => {
    table.uuid('assignedUniversityId').nullable();
    table.foreign('assignedUniversityId').references('id').inTable('universities');
  });
}