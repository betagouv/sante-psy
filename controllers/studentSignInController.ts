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
    const existingToken = await dbStudentLoginToken.getByEmail(email);
    const signInValidationUrl = loginInformations.generateStudentSignInStepTwoUrl();
    const loginUrl = loginInformations.generateStudentLoginUrl();
    const token = existingToken ? existingToken.token : loginInformations.generateToken(32);
    let expiresAt;

    if (!existingStudent) {
      expiresAt = date.getDateInAWeek();
    } else {
      expiresAt = date.getDatePlusTwoHours();
    }

    if (existingToken) {
      await dbStudentLoginToken.update(email, expiresAt);
    } else {
      await dbStudentLoginToken.insert(token, email, expiresAt);
    }
    await sendStudentMailTemplate(
      email,
      // todo: check if this step works well when loginEmail is set in login ticket
      existingStudent ? loginUrl : signInValidationUrl,
      token,
      existingStudent ? 'studentLogin' : 'studentSignInValidation',
      existingStudent ? 'Connexion à votre espace' : 'Étape 2 de votre inscription',
    );

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
    const existingToken = await dbStudentLoginToken.getByEmail(email);
    const loginUrl = loginInformations.generateStudentLoginUrl();
    const token = existingToken ? existingToken.token : loginInformations.generateToken(32);
    const expiresAt = date.getDatePlusTwoHours();

    if (existingToken) {
      await dbStudentLoginToken.update(email, expiresAt);
    } else {
      await dbStudentLoginToken.insert(token, email, expiresAt);
    }
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

    const tokenRow = await dbStudentLoginToken.getByToken(token);

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
    switch (result.status) {
    case 'created':
      await sendWelcomeMail(email);
      res.status(201).json({ status: 'created' });
      break;
    case 'alreadyRegistered':
      // todo: changer le mail envoyé dans le login ticket
      await sendWelcomeMail(email);
      res.status(200).json({ status: 'alreadyRegistered' });
      break;
    case 'conflict':
      res.status(409).json({ status: 'conflict' });
      break;
    default:
      throw new CustomError('Erreur interne', 500);
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
  sendWelcomeMail: asyncHelper(sendWelcomeMail),
  verifyStudentToken: asyncHelper(verifyStudentToken),
  signIn: asyncHelper(signIn),
  studentEmailValidator: emailValidator,
  studentSignInValidator: signInValidator,
};
