import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .createTable('assigned_university', (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
      table.uuid('universityId').notNullable();
      table.uuid('psychologistId').notNullable();
      table.timestamp('assignedAt').defaultTo(knex.fn.now()).notNullable();
      table.timestamp('unassignedAt').nullable(); // null = assignment encore active
      table.timestamp('createdAt').defaultTo(knex.fn.now());
      table.timestamp('updatedAt');

      // Contraintes
      table.foreign('universityId').references('id').inTable('universities').onDelete('CASCADE');
      table.foreign('psychologistId').references('id').inTable('psychologists').onDelete('CASCADE');
      
      // Index pour les requêtes fréquentes
      table.index(['psychologistId', 'assignedAt']);
      table.index(['universityId', 'assignedAt']);
      
      // Contrainte unique : un psy ne peut pas avoir 2 assignations actives en même temps
      table.unique(['psychologistId'], {
        predicate: knex.whereNull('unassignedAt'),
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('assigned_university');
}
