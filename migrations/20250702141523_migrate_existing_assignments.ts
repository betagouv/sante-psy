import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // Migrer les assignations existantes depuis la colonne assignedUniversity
  const psychologists = await knex('psychologists')
    .select('id', 'assignedUniversity', 'createdAt')
    .whereNotNull('assignedUniversity');

  if (psychologists.length > 0) {
    const assignments = psychologists.map((psy) => ({
      psychologist_id: psy.id,
      university_id: psy.assignedUniversity,
      assigned_at: psy.createdAt,
      created_at: psy.createdAt,
    }));

    await knex('assigned_university').insert(assignments);
  }

  console.log(`Migrated ${psychologists.length} existing university assignments`);
}

export async function down(knex: Knex): Promise<void> {
  // Supprimer toutes les assignations migrées
  await knex('assigned_university').del();
}