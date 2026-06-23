import { Request, Response } from 'express';
import studentAppointments from '../services/studentAppointments';
import dbStudents from '../db/students';
import sendModifyEmailLink from '../services/email/sendModifyEmailLink';
import loginInformations from '../services/loginInformations';
import config from '../utils/config';

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
    const studentId = req.auth.userId;

    if (!studentId) {
      res.status(400).json({ error: 'Student ID manquant' });
      return;
    }

    const student = await dbStudents.getById(studentId);

    const { email, ine } = student;

    const appointments = await studentAppointments.getStudentAppointments(email, ine);

    res.json(appointments);
    // TODO : nombreux try catch qui servent pas car error deja géré dans méthode ! à enlever partout
  } catch (err) {
    res.status(500).json({
      error: err instanceof Error ? err.message : 'Erreur inconnue',
    });
  }
};

const requestEmailChange = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const studentId = req.auth.userId;
    const { email: newEmail } = req.body;

    if (!studentId) {
      res.status(401).json({ error: 'Étudiant non authentifié' });
      return;
    }

    if (!newEmail || typeof newEmail !== 'string') {
      res.status(400).json({ error: 'Nouvel email souhaité manquant ou invalide' });
      return;
    }

    const student = await dbStudents.getById(studentId);

    const duplicate = await dbStudents.checkDuplicates(newEmail, student.ine);
    if (duplicate.status === 'alreadyRegistered') {
      res.status(400).json({ error: "Nouvel email souhaité similaire à l'ancien" });
      return;
    }

    const emailAlreadyUsed = await dbStudents.getByEmail(newEmail)
    if (emailAlreadyUsed) {
      res.status(400).json({ error: 'Erreur. Réessaye ou contacte le support.' });
      return;
    }

    const token = loginInformations.generateToken(32);
    const modifyEmailUrl = `${config.hostnameWithProtocol}/etudiant/confirmer-email`
    await dbStudents.savePendingEmailChange(studentId, newEmail, token);
    sendModifyEmailLink(
      newEmail,
      modifyEmailUrl,
      token
    );

    res.json({ message: 'Demande enregistrée.' });
  } catch (err) {
    console.error('Error in requestEmailChange:', err);
    res.status(500).json({ error: 'Erreur interne, réessaye plus tard.' });
  }
};
