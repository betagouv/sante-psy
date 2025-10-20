import db from '../db/db';
import { assignedUniversityTable, psychologistsTable } from '../db/tables';
import date from '../utils/date';

/**
 * Migre toutes les assignations existantes depuis la colonne assignedUniversityId
 * vers la nouvelle table assigned_university
 */
const migrateAllExistingAssignments = async (): Promise<void> => {
  console.log('Starting migration of ALL existing university assignments...');

  const trx = await db.transaction();

  try {
    // Récupérer tous les psychologues qui ont une université assignée
    const psychologists = await trx(psychologistsTable)
      .select('dossierNumber', 'assignedUniversityId', 'createdAt')
      .whereNotNull('assignedUniversityId');

    console.log(`Found ${psychologists.length} psychologists with assigned universities`);

    if (psychologists.length === 0) {
      await trx.commit();
      return;
    }

    const now = date.now();
    const assignments = psychologists.map((psy) => ({
      psychologistId: psy.dossierNumber,
      universityId: psy.assignedUniversityId,
      assignedAt: psy.createdAt || now,
      createdAt: now,
    }));

    // Insérer toutes les assignations
    await trx(assignedUniversityTable).insert(assignments);

    await trx.commit();
    console.log(`Successfully migrated ${assignments.length} university assignments`);

  } catch (error) {
    await trx.rollback();
    console.error('Error during migration:', error);
    throw error;
  }
};

// Exécuter si appelé directement
if (require.main === module) {
  migrateAllExistingAssignments()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default migrateAllExistingAssignments;