import { Request, Response } from 'express';
import asyncHelper from '../utils/async-helper';
import dbStudents from '../db/students';
import dbLoginToken from '../db/loginToken';
import CustomError from '../utils/CustomError';
import { signInValidator, emailValidator } from './validators/studentValidators';
import loginInformations from '../services/loginInformations';
import date from '../utils/date';
import db from '../db/db';
import { studentsTable } from '../db/tables';
import loginController from './loginController';
import sendStudentMailTemplate from '../services/sendStudentMailTemplate';
import validation from '../utils/validation';

const sendStudentSecondStepMail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const existingStudent = await db(studentsTable).where({ email }).first();
    const token = loginInformations.generateToken(32);
    const isNewStudent = !existingStudent;

    const expiresAt = isNewStudent
      ? date.getDatePlusSevenDays()
      : date.getDatePlusTwoHours();

    await dbLoginToken.upsert(token, email, expiresAt, 'student');

    if (isNewStudent) {
      await sendStudentMailTemplate(
        email,
        loginInformations.generateStudentSignInStepTwoUrl(),
        token,
        'studentSignInValidation',
        'Étape 2 de votre inscription',
      );
    } else {
      await loginController.sendStudentLoginEmail(
        email,
        loginInformations.generateLoginUrl(),
        token,
      );
    }

    res.json({
      message: 'Consultez votre boîte mail',
    });
  } catch (err) {
    console.error(err);
    throw err instanceof CustomError ? err : new CustomError("Erreur lors de l'envoi du mail de connexion", 500);
  }
};

const sendWelcomeMail = async (email): Promise<void> => {
  try {
    const loginUrl = loginInformations.generateLoginUrl();
    const token = loginInformations.generateToken(32);
    const expiresAt = date.getDatePlusTwoHours();

    await dbLoginToken.upsert(token, email, expiresAt, 'student');
    await sendStudentMailTemplate(
      email,
      loginUrl,
      token,
      'studentWelcome',
      'Bienvenue !',
    );
  } catch (err) {
    console.error(err);
    throw err instanceof CustomError ? err : new CustomError("Erreur lors de l'envoi du mail de connexion", 500);
  }
};

const verifyStudentToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const tokenRow = await dbLoginToken.getByToken(token);

    if (!tokenRow) {
      throw new CustomError('Token invalide', 401);
    }

    if (new Date(tokenRow.expiresAt) < new Date()) {
      throw new CustomError('Token expiré', 401);
    }

    res.json({ email: tokenRow.email });
  } catch (err) {
    console.error(err);
    throw err instanceof CustomError
      ? err
      : new CustomError('Erreur validation token', 500);
  }
};

const signIn = async (req: Request, res: Response): Promise<void> => {
  try {
    validation.checkErrors(req);
    const { firstNames, ine, email } = req.body;

    const result = await dbStudents.signIn(email, ine, firstNames);
    if (result.status === 'created') {
      await sendWelcomeMail(email);
    }
    if (result.status === 'alreadyRegistered') {
      const token = loginInformations.generateToken(32);
      const expiresAt = date.getDatePlusTwoHours();

      await dbLoginToken.upsert(token, email, expiresAt, 'student');
      await loginController.sendStudentLoginEmail(
        email,
        loginInformations.generateLoginUrl(),
        token,
      );
    }

    res.status(200).json({
      message: 'Si un compte existe, un email vous a été envoyé.',
    });
  } catch (err) {
    console.error(err);

    res.status(200).json({
      message: 'Si un compte existe, un email vous a été envoyé.',
    });
  }
};

export default {
  sendStudentSecondStepMail: asyncHelper(sendStudentSecondStepMail),
  sendWelcomeMail: asyncHelper(sendWelcomeMail),
  verifyStudentToken: asyncHelper(verifyStudentToken),
  signIn: asyncHelper(signIn),
  emailValidator,
  studentSignInValidator: signInValidator,
};
