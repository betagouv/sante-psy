import db from '../db/db';
import { assignedUniversityTable } from '../db/tables';
import date from '../utils/date';
import psyToUniMapping from './psyToUni';

/**
 * Script de migration pour créer les assignations d'universités 
 * basées sur le mapping existant dans psyToUni.ts
 */
const migrateExistingAssignments = async (): Promise<void> => {
  console.log('Starting migration of existing university assignments...');

  try {
    // Récupérer toutes les universités
    const universities = await db('universities').select('id', 'name');
    const universityByName = universities.reduce((acc, uni) => {
      acc[uni.name] = uni.id;
      return acc;
    }, {} as Record<string, string>);

    // Récupérer les psychologues concernés
    const psychologists = await db('psychologists')
      .select('dossierNumber', 'personalEmail', 'createdAt')
      .whereIn('personalEmail', Object.keys(psyToUniMapping));

    const assignments = [];
    const now = date.now();

    for (const psy of psychologists) {
      const universityName = psyToUniMapping[psy.personalEmail];
      const universityId = universityByName[universityName];

      if (!universityId) {
        console.warn(`University "${universityName}" not found for ${psy.personalEmail}`);
        continue;
      }

      assignments.push({
        psychologistId: psy.dossierNumber,
        universityId,
        assignedAt: psy.createdAt || now,
        createdAt: now,
      });
    }

    if (assignments.length > 0) {
      await db(assignedUniversityTable).insert(assignments);
      console.log(`Migrated ${assignments.length} university assignments`);
    } else {
      console.log('No assignments to migrate');
    }

  } catch (error) {
    console.error('Error during migration:', error);
    throw error;
  }
};

// Si le script est exécuté directement
if (require.main === module) {
  migrateExistingAssignments()
    .then(() => {
      console.log('Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export default migrateExistingAssignments;