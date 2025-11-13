import { Request, Response } from 'express';

import { check } from 'express-validator';
import ejs from 'ejs';
import validation from '../utils/validation';
import dbStudentLoginToken from '../db/studentLoginToken';
import logs from '../utils/logs';
import sendEmail from '../utils/email';
import config from '../utils/config';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import loginInformations from '../services/loginInformations';
import db from '../db/db';
import { studentsTable } from '../db/tables';
import date from '../utils/date';

const emailValidators = [
  check('email')
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
];

async function sendStudentValidationMail(email: string, loginUrl: string, token: string): Promise<void> {
  try {
    const html = await ejs.renderFile('./views/emails/studentSignInValidation.ejs', {
      loginUrlWithToken: `${loginUrl}/${encodeURIComponent(token)}`,
      appName: config.appName,
      loginUrl,
    });
    await sendEmail(email, `Connexion à ${config.appName}`, html);
    console.log(`Login email sent for ${logs.hash(email)}`);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail - sendStudentSignInValidationEmail");
  }
}

async function sendStudentLoginEmail(email: string, loginUrl: string, token: string): Promise<void> {
  try {
    const html = await ejs.renderFile('./views/emails/studentLogin.ejs', {
      loginUrlWithToken: `${loginUrl}/${encodeURIComponent(token)}`,
      appName: config.appName,
      loginUrl,
    });
    await sendEmail(email, `Connexion à ${config.appName}`, html);
    console.log(`Login email sent for ${logs.hash(email)}`);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail - sendStudentLoginEmail");
  }
}

async function saveStudentToken(email: string, token: string, expiredAt: string): Promise<void> {
  try {
    await dbStudentLoginToken.insert(token, email, expiredAt);

    console.log(`Login token created for ${logs.hash(email)}`);
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}

const sendStudentConnexionMail = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { email, ine } = req.body;
  const loginUrl = loginInformations.generateLoginUrl();
  const token = loginInformations.generateToken(32);
  const expiredInAnHour = date.getDatePlusOneHour();

  console.log(`User with ${logs.hash(email)} asked for a login link`);
  const existingStudent = await db(studentsTable)
    .where({ email, ine })
    .first();

  if (!existingStudent.validated) {
    const expiredInAWeek = date.getDateInAWeek();
    await sendStudentValidationMail(email, loginUrl, token);
    await saveStudentToken(email, token, expiredInAWeek);
    throw new CustomError(
      'Nous n\'avons pas pu vous envoyer le mail de validation de compte, veuillez rééssayer plus tard.',
      401,
    );
  }

  await sendStudentLoginEmail(email, loginUrl, token);
  await saveStudentToken(email, token, expiredInAnHour);
  res.json({
    message: `Un lien de connexion a été envoyé à l'adresse ${email
    }. Le lien est valable ${config.sessionDurationHours} heures.`,
  });
};

export default {
  emailValidators,
  sendStudentMail: asyncHelper(sendStudentConnexionMail),
};
