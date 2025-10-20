import assignedUniversityDB from '../db/assignedUniversity';
import { Request, Response } from 'express';

/**
 * POST /api/psychologists/:id/assign-university
 * Assigne un psychologue à une université
 */
const assignUniversity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { psychologistId } = req.params;
    const { universityId } = req.body;

    if (!universityId) {
      res.status(400).json({ message: 'universityId is required' });
      return;
    }

    const assignment = await assignedUniversityDB.assignPsychologistToUniversity(
      psychologistId,
      universityId,
    );

    res.status(201).json(assignment);
  } catch (error) {
    console.error('Error assigning university:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * DELETE /api/psychologists/:id/assign-university
 * Désassigne un psychologue de son université
 */
const unassignUniversity = async (req: Request, res: Response): Promise<void> => {
  try {
    const { psychologistId } = req.params;

    await assignedUniversityDB.unassignPsychologist(psychologistId);

    res.status(200).json({ message: 'University unassigned successfully' });
  } catch (error) {
    console.error('Error unassigning university:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /api/psychologists/:id/university-history
 * Récupère l'historique des assignations d'un psychologue
 */
const getUniversityHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { psychologistId } = req.params;

    const history = await assignedUniversityDB.getAssignmentHistory(psychologistId);

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching university history:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /api/universities/:id/psychologists
 * Récupère tous les psychologues assignés à une université
 */
const getUniversityPsychologists = async (req: Request, res: Response): Promise<void> => {
  try {
    const { universityId } = req.params;

    const assignments = await assignedUniversityDB.getPsychologistsByUniversity(universityId);

    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching university psychologists:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export default {
  assignUniversity,
  unassignUniversity,
  getUniversityHistory,
  getUniversityPsychologists,
};