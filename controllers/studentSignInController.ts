import { Request, Response } from 'express';
import asyncHelper from '../utils/async-helper';
import dbStudents from '../db/students';
import dbStudentLoginToken from '../db/studentLoginToken';
import CustomError from '../utils/CustomError';
import { signInValidator, emailValidator } from './validators/studentValidators';
import loginInformations from '../services/loginInformations';
import date from '../utils/date';
import db from '../db/db';
import { studentsTable } from '../db/tables';
import sendStudentMailTemplate from './studentMailController';
import validation from '../utils/validation';

const sendStudentSecondStepMail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const existingStudent = await db(studentsTable).where({ email }).first();

    if (!existingStudent) {
      const signInValidationUrl = loginInformations.generateStudentSignInValidationUrl();
      const token = loginInformations.generateToken(32);
      const expiredAt = date.getDateInAWeek();

      const existingToken = await dbStudentLoginToken.getStudentByEmail(email);
      if (existingToken) {
        await dbStudentLoginToken.update(email, expiredAt);
      } else {
        await dbStudentLoginToken.insert(token, email, expiredAt);
      }
      await sendStudentMailTemplate(email, signInValidationUrl, token, 'studentSignInValidation');
    }
    res.json({
      message: 'Consultez votre boîte mail',
    });
  } catch (err) {
    console.error(err);
    throw err instanceof CustomError ? err : new CustomError('Erreur lors de l’envoi du mail de connexion', 500);
  }
};

const verifyStudentToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.params;

    const tokenRow = await dbStudentLoginToken.getStudentByToken(token);

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
    const existingStudent = await db(studentsTable).where({ email }).first();

    if (!existingStudent) {
      const result = await dbStudents.signIn(email, ine, firstNames);
      switch (result.status) {
      case 'created':
        // todo le welcome mail avec lien de co => à mettre ici
        // await sendStudentWelcomeMail(email);
        res.status(201).json({ status: 'created' });
        break;
      case 'alreadyRegistered':
        // send lien de connexion => à mettre dans loginController ?
        res.status(200).json({ status: 'alreadyRegistered' });
        break;
      case 'conflict':
        res.status(409).json({ status: 'conflict' });
        break;
      default:
        throw new CustomError('Erreur interne', 500);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(err instanceof CustomError ? err.statusCode : 500).json({
      error: err instanceof CustomError ? err.message : 'Erreur serveur',
    });
  }
};

export default {
  sendStudentSecondStepMail: asyncHelper(sendStudentSecondStepMail),
  verifyStudentToken: asyncHelper(verifyStudentToken),
  signIn: asyncHelper(signIn),
  studentEmailValidator: emailValidator,
  studentSignInValidator: signInValidator,
};
