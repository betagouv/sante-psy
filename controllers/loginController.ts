import { Request, Response } from 'express';

import { check } from 'express-validator';
import ejs from 'ejs';
import validation from '../utils/validation';
import dbPsychologists from '../db/psychologists';
import dbStudents from '../db/students';
import dbSuspensions from '../db/suspensionReasons';
import dbLoginToken from '../db/loginToken';
import dbLastConnection from '../db/lastConnections';
import date from '../utils/date';
import cookie from '../utils/cookie';
import logs from '../utils/logs';
import sendEmail from '../utils/email';
import config from '../utils/config';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import { checkXsrf } from '../middlewares/xsrfProtection';
import loginInformations from '../services/loginInformations';
import DOMPurify from '../services/sanitizer';

const emailValidators = [
  check('email')
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
];

async function sendPsyLoginEmail(email: string, loginUrl: string, token: string): Promise<void> {
  try {
    const html = await ejs.renderFile('./views/emails/psyLogin.ejs', {
      loginUrlWithToken: `${loginUrl}/${encodeURIComponent(token)}`,
      appName: config.appName,
      loginUrl,
    });
    await sendEmail(email, `Connexion à ${config.appName}`, html);
    console.log(`Login email sent for ${logs.hash(email)}`);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail - sendPsyLoginEmail");
  }
}

async function sendStudentLoginEmail(email: string, loginUrl: string, token: string): Promise<void> {
  try {
    const html = await ejs.renderFile('./views/emails/studentLogin.ejs', {
      loginUrlWithToken: `${loginUrl}/${encodeURIComponent(token)}`,
      site: `${config.hostnameWithProtocol}/login`,
    });
    await sendEmail(email, `Connexion à ${config.appName}`, html);
    console.log(`Login email sent for ${logs.hash(email)}`);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail - sendStudentLoginEmail");
  }
}

async function sendNotYetAcceptedEmail(email: string): Promise<void> {
  try {
    const html = await ejs.renderFile('./views/emails/loginNotAcceptedYet.ejs', {
      appName: config.appName,
    });
    await sendEmail(email, `C'est trop tôt pour vous connecter à ${config.appName}`, html);
    console.log(`Not yet accepted email sent for ${logs.hash(email)}`);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail - sendNotYetAcceptedEmail");
  }
}

async function savePsyToken(email: string, token: string): Promise<void> {
  try {
    const expiredAt = date.getDatePlusOneHour();
    await dbLoginToken.upsert(token, email, expiredAt);

    console.log(`Login token created for ${logs.hash(email)}`);
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}

async function saveStudentToken(email: string, token: string): Promise<void> {
  try {
    const expiresAt = date.getDatePlusTwoHours();
    await dbLoginToken.upsert(token, email, expiresAt);

    console.log(`Login token created for ${logs.hash(email)}`);
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}

const deleteToken = (req: Request, res: Response): void => {
  cookie.clearJwtCookie(res);
  res.json({ });
};

const connectedPsy = async (req: Request, res: Response): Promise<void> => {
  const tokenData = cookie.verifyJwt(req, res);
  if (tokenData && checkXsrf(req, tokenData.xsrfToken)) {
    const psy = await dbPsychologists.getById(tokenData.psychologist);
    const convention = await dbPsychologists.getConventionInfo(tokenData.psychologist);

    if (psy) {
      const { reason: inactiveReason, until: inactiveUntil } = psy.active
        ? { reason: undefined, until: undefined }
        : await dbSuspensions.getByPsychologist(psy.dossierNumber);
      const {
        dossierNumber,
        firstNames,
        lastName,
        useFirstNames,
        useLastName,
        email,
        active,
        adeli,
        address,
        otherAddress,
        hasSeenTutorial,
        createdAt,
      } = psy;
      res.json({
        dossierNumber,
        firstNames,
        lastName,
        useFirstNames,
        useLastName,
        adeli,
        address,
        otherAddress,
        email,
        convention,
        active,
        hasSeenTutorial,
        createdAt,
        inactiveReason,
        inactiveUntil,
      });

      return;
    }
  }

  res.json();
};

const connectedStudent = async (req: Request, res: Response): Promise<void> => {
  const tokenData = cookie.verifyJwt(req, res);
  if (tokenData && checkXsrf(req, tokenData.xsrfToken)) {
    const student = await dbStudents.getById(tokenData.psychologist);

    if (student) {
      const {
        id,
        firstNames,
        ine,
        email,
        createdAt,
      } = student;
      res.json({
        id,
        firstNames,
        ine,
        email,
        createdAt,
      });

      return;
    }
  }

  res.json();
};

const login = async (req: Request, res: Response): Promise<void> => {
  // Save a token that expire after config.sessionDurationHours hours if user is logged
  if (req.body.token) {
    const token = DOMPurify.sanitize(req.body.token);
    const dbToken = await dbLoginToken.getByToken(token);

    if (dbToken) {
      const psychologistData = await dbPsychologists.getAcceptedByEmail(dbToken.email);
      const xsrfToken = loginInformations.generateToken();
      cookie.createAndSetJwtCookie(res, psychologistData.dossierNumber, xsrfToken);
      console.log(`Successful authentication for ${logs.hash(dbToken.email)}`);

      dbLoginToken.delete(token);
      dbLastConnection.upsert(psychologistData.dossierNumber);

      res.json(xsrfToken);
      return;
    }

    console.log(`Invalid or expired token received : ${token.substring(0, 5)}...`);
  }

  throw new CustomError(
    'Ce lien est invalide ou expiré. Indiquez votre email ci dessous pour en avoir un nouveau.',
    401,
  );
};

const studentLogin = async (req: Request, res: Response): Promise<void> => {
  if (req.body.token) {
    const token = DOMPurify.sanitize(req.body.token);
    const dbToken = await dbLoginToken.getByToken(token);

    if (dbToken) {
      const studentData = await dbStudents.getByEmail(dbToken.email);
      const xsrfToken = loginInformations.generateToken();
      cookie.createAndSetJwtCookie(res, studentData.id, xsrfToken);
      console.log(`Successful authentication for ${logs.hash(dbToken.email)}`);

      dbLoginToken.delete(token);

      res.json(xsrfToken);
      return;
    }

    console.log(`Invalid or expired token received : ${token.substring(0, 5)}...`);
  }

  throw new CustomError(
    'Ce lien est invalide ou expiré. Indiquez votre email ci-dessous pour en avoir un nouveau.',
    401,
  );
};

/**
 * Send a email with a login link if the email is already registered
 */
const sendMail = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { email } = req.body;

  console.log(`User with ${logs.hash(email)} asked for a login link`);
  const acceptedEmailExist = await dbPsychologists.getAcceptedByEmail(email);
  const notYetAcceptedEmailExist = await dbPsychologists.getNotYetAcceptedByEmail(email);

  if (acceptedEmailExist) {
    const token = loginInformations.generateToken(32);
    const loginUrl = loginInformations.generateLoginUrl();
    await sendPsyLoginEmail(email, loginUrl, token);
    await savePsyToken(email, token);
  } else if (notYetAcceptedEmailExist) {
    await sendNotYetAcceptedEmail(email);
    throw new CustomError(
      'Votre compte n\'est pas encore validé par nos services, veuillez rééssayer plus tard.',
      401,
    );
  } else {
    console.warn(`Email inconnu -ou sans suite ou refusé- qui essaye d'accéder au service : ${
      logs.hash(email)}
      `);
  }

  res.json({});
};

const sendStudentMail = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { email } = req.body;

  console.log(`Student with ${logs.hash(email)} asked for a login link`);
  const studentIsRegistered = await dbStudents.getByEmail(email);
  const existingToken = await dbLoginToken.getByEmail(email);
  let token;

  if (existingToken) {
    token = existingToken.token;
  } else {
    token = loginInformations.generateToken(32);
  }

  if (studentIsRegistered) {
    const loginUrl = loginInformations.generateLoginUrl();
    await saveStudentToken(email, token);
    await sendStudentLoginEmail(email, loginUrl, token);
  }

  res.json({});
};

export default {
  emailValidators,
  connectedPsy: asyncHelper(connectedPsy),
  connectedStudent: asyncHelper(connectedStudent),
  login: asyncHelper(login),
  studentLogin: asyncHelper(studentLogin),
  sendMail: asyncHelper(sendMail),
  sendStudentMail: asyncHelper(sendStudentMail),
  sendStudentLoginEmail,
  deleteToken,
};
