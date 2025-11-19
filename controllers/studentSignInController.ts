import { Request, Response } from 'express';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';
import dbStudents from '../db/students';
import dbStudentLoginToken from '../db/studentLoginToken';
import CustomError from '../utils/CustomError';
import { signInValidator } from './validators/studentValidators';
import sendStudentValidationMail from './studentValidationController';

const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    validation.checkErrors(req);
    const { email } = req.body;
    await dbStudents.signIn(email);
    await sendStudentValidationMail(email);
    res.status(201).json({ status: 'created' });
  } catch (err) {
    console.error(err);
    const statusCode = err instanceof CustomError ? err.statusCode : 500;
    const message = err instanceof CustomError ? err.message : 'Erreur serveur';
    res.status(statusCode).json({ error: message });
  }
};

const validateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;
    const tokenRecord = await dbStudentLoginToken.getStudentByToken(token);
    if (!tokenRecord) throw new CustomError('Ce lien est invalide ou expiré.', 401);

    const student = await dbStudents.getStudentByEmail(tokenRecord.email);
    if (!student) throw new CustomError('Compte introuvable.', 404);

    await dbStudents.validateStudentAccount(student.email);
    await dbStudentLoginToken.delete(token);

    res.json({
      message: 'Votre compte a été validé avec succès. Vous pouvez maintenant vous connecter.',
    });
  } catch (err) {
    console.error(err);
    res.status(err instanceof CustomError ? err.statusCode : 500).json({
      error: err instanceof CustomError ? err.message : 'Erreur serveur',
    });
  }
};

export default {
  signIn: asyncHelper(signIn),
  studentSignInValidator: signInValidator,
  validateStudent: asyncHelper(validateStudent),
};
