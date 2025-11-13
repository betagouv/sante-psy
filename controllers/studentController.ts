import { Request, Response } from 'express';
import { check } from 'express-validator';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';
import { purifySanitizer } from '../services/sanitizer';
import dbStudents from '../db/students';
import { inePatterns } from './validators/patientValidators';
import ejs from 'ejs';
import dbStudentLoginToken from '../db/studentLoginToken';
import logs from '../utils/logs';
import sendEmail from '../utils/email';
import config from '../utils/config';
import CustomError from '../utils/CustomError';
import loginInformations from '../services/loginInformations';
import db from '../db/db';
import { studentsTable } from '../db/tables';
import date from '../utils/date';

// TODO
  // gestion d'erreur à ajouter
  // optimiser et faire qu'une seule méthode pour studentLogin et validation
  // si mail associé au token existe déjà, renvoyer le même et update expiresAt
  // valider mon compte quand je clique sur lien dans mail de validation

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

const sendStudentConnexionMail = async (email: string, ine: string): Promise<void> => {
  const loginUrl = loginInformations.generateLoginUrl();
  const token = loginInformations.generateToken(32);
  let expiredAt = date.getDatePlusOneHour();

  console.log(`User with ${logs.hash(email)} asked for a login link`);
  const existingStudent = await db(studentsTable)
    .where({ email, ine })
    .first();

  if (!existingStudent.validated) {
    expiredAt = date.getDateInAWeek();
    await sendStudentValidationMail(email, loginUrl, token);
  } else {
    await sendStudentLoginEmail(email, loginUrl, token);
  }

  await saveStudentToken(email, token, expiredAt);
};

const signInValidator = [
  check('firstNames')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Le prénom est obligatoire.')
    .customSanitizer(purifySanitizer),

  check('ine')
      .trim().not().isEmpty()
      .withMessage('Le numéro INE est obligatoire.')
      .customSanitizer(purifySanitizer)
      .custom((value) => {
        const isValid = inePatterns.some((pattern) => pattern.test(value));
        if (!isValid) {
          throw new Error('Le numéro INE est invalide. Veuillez vérifier le format.');
        }
        return true;
      }),

  check('email').isEmail().withMessage('Vous devez spécifier un email valide.').customSanitizer(purifySanitizer),
];

const signIn = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { firstNames, ine, email } = req.body;

  const result = await dbStudents.signIn(email, ine, firstNames);

  switch (result.status) {
  case 'created': {
    await sendStudentConnexionMail(email, ine);
    res.status(201).json({ status: 'created' });
    break;
  }

  case 'alreadyRegistered':
    res.status(200).json({ status: 'alreadyRegistered' });
    break;

  case 'accountNotValidated': {
    await sendStudentConnexionMail(email, ine);
    res.status(200).json({ status: 'accountNotValidated' });
    break;
  }

  case 'conflict':
    res.status(409).json({ status: 'conflict' });
    break;

  default:
    res.status(500).json({ status: 'error' });
    break;
  }
};

const validateStudent = async (req: Request, res: Response): Promise<void> => {
  const { token } = req.params;

  const tokenRecord = await dbStudentLoginToken.getStudentByToken(token);
  if (!tokenRecord) {
    throw new CustomError('Ce lien est invalide ou expiré.', 401);
  }

  const student = await dbStudents.getStudentByEmail(tokenRecord.email);
  if (!student) {
    throw new CustomError('Compte introuvable.', 404);
  }

  await dbStudents.validateStudentAccount(student.email);
  await dbStudentLoginToken.delete(token);

  res.json({
    message: 'Votre compte a été validé avec succès. Vous pouvez maintenant vous connecter.',
  });
};

export default {
  signInValidator,
  emailValidators,
  signIn: asyncHelper(signIn),
  validateStudent: asyncHelper(validateStudent),
  sendStudentMail: asyncHelper(sendStudentConnexionMail),
};
