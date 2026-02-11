import { Request, Response } from 'express';
import studentAppointments from '../services/studentAppointments';
import dbStudents from '../db/students';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
  };
}

const getStudentAppointments = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      res.status(400).json({ error: 'Student ID manquant' });
      return;
    }

    const student = await dbStudents.getById(studentId);

    if (!student) {
      res.status(404).json({ error: 'Étudiant introuvable' });
      return;
    }

    const { email, ine } = student;

    const appointments = await studentAppointments.getStudentAppointments(email, ine);

    res.json(appointments);
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Erreur inconnue',
    });
  }
};

export default { getStudentAppointments };
