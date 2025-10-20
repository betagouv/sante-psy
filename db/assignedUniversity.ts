import db from './db';
import { assignedUniversityTable } from './tables';
import date from '../utils/date';

export interface AssignedUniversity {
  id: string;
  universityId: string;
  psychologistId: string;
  assignedAt: Date;
  unassignedAt?: Date;
  createdAt: Date;
  updatedAt?: Date;
}

/**
 * Assigne un psychologue à une université
 * Si le psy a déjà une assignation active, elle sera fermée automatiquement
 */
const assignPsychologistToUniversity = async (
  psychologistId: string,
  universityId: string,
): Promise<AssignedUniversity> => {
  const trx = await db.transaction();

  try {
    const now = date.now();

    // Fermer toute assignation active existante
    await trx(assignedUniversityTable)
      .where('psychologistId', psychologistId)
      .whereNull('unassignedAt')
      .update({
        unassignedAt: now,
        updatedAt: now,
      });

    // Créer la nouvelle assignation
    const [newAssignment] = await trx(assignedUniversityTable)
      .insert({
        psychologistId,
        universityId,
        assignedAt: now,
        createdAt: now,
      })
      .returning('*');

    await trx.commit();
    return newAssignment;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};

/**
 * Désassigne un psychologue de son université actuelle
 */
const unassignPsychologist = async (psychologistId: string): Promise<void> => {
  const now = date.now();

  await db(assignedUniversityTable)
    .where('psychologistId', psychologistId)
    .whereNull('unassignedAt')
    .update({
      unassignedAt: now,
      updatedAt: now,
    });
};

/**
 * Récupère l'assignation actuelle d'un psychologue
 */
const getCurrentAssignment = async (
  psychologistId: string,
): Promise<AssignedUniversity | undefined> => {
  const assignment = await db(assignedUniversityTable)
    .where('psychologistId', psychologistId)
    .whereNull('unassignedAt')
    .first();

  return assignment;
};

/**
 * Récupère l'historique des assignations d'un psychologue
 */
const getAssignmentHistory = async (
  psychologistId: string,
): Promise<AssignedUniversity[]> => {
  const assignments = await db(assignedUniversityTable)
    .where('psychologistId', psychologistId)
    .orderBy('assignedAt', 'desc');

  return assignments;
};

/**
 * Récupère tous les psychologues assignés à une université
 */
const getPsychologistsByUniversity = async (
  universityId: string,
): Promise<AssignedUniversity[]> => {
  const assignments = await db(assignedUniversityTable)
    .where('universityId', universityId)
    .whereNull('unassignedAt');

  return assignments;
};

/**
 * Migration : transfert les données existantes de psychologists.assignedUniversity
 */
const migrateExistingAssignments = async (): Promise<void> => {
  const psychologists = await db('psychologists')
    .select('id', 'assignedUniversity', 'createdAt')
    .whereNotNull('assignedUniversity');

  const assignments = psychologists.map((psy) => ({
    psychologistId: psy.id,
    universityId: psy.assignedUniversity,
    assignedAt: psy.createdAt,
    createdAt: psy.createdAt,
  }));

  if (assignments.length > 0) {
    await db(assignedUniversityTable).insert(assignments);
  }
};

export default {
  assignPsychologistToUniversity,
  unassignPsychologist,
  getCurrentAssignment,
  getAssignmentHistory,
  getPsychologistsByUniversity,
  migrateExistingAssignments,
};