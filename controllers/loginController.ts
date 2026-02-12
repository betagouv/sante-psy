import { Request, Response } from 'express';

import ejs from 'ejs';
import { check } from 'express-validator';
import dbLastConnection from '../db/lastConnections';
import dbLoginToken from '../db/loginToken';
import dbPsychologists from '../db/psychologists';
import dbStudents from '../db/students';
import dbSuspensions from '../db/suspensionReasons';
import { checkXsrf } from '../middlewares/xsrfProtection';
import loginInformations from '../services/loginInformations';
import DOMPurify from '../services/sanitizer';
import asyncHelper from '../utils/async-helper';
import config from '../utils/config';
import cookie from '../utils/cookie';
import CustomError from '../utils/CustomError';
import date from '../utils/date';
import sendEmail from '../utils/email';
import logs from '../utils/logs';
import validation from '../utils/validation';

const emailValidators = [
  check('email')
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
];

// TODO : to refacto all doc to mutualize some methods looking alike
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
    await dbLoginToken.upsert(token, email, expiredAt, 'psy');

    console.log(`Login token created for ${logs.hash(email)}`);
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}

async function saveStudentToken(email: string, token: string): Promise<void> {
  try {
    const expiresAt = date.getDatePlusTwoHours();
    await dbLoginToken.upsert(token, email, expiresAt, 'student');

    console.log(`Login token created for ${logs.hash(email)}`);
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}

const deleteToken = async (req: Request, res: Response): Promise<void> => {
  const tokenData = cookie.verifyJwt(req, res);

  if (tokenData) {
    const userId = tokenData.userId || tokenData.psychologist;
    const { role } = tokenData;

    // Delete login token from DB to invalidate email link
    if (role === 'psy') {
      const psy = await dbPsychologists.getById(userId);
      if (psy) {
        await dbLoginToken.deleteByEmail(psy.email);
      }
    } else if (role === 'student') {
      const student = await dbStudents.getById(userId);
      if (student) {
        await dbLoginToken.deleteByEmail(student.email);
      }
    }
  }

  cookie.clearJwtCookie(res);
  res.json({ });
};

const login = async (req: Request, res: Response): Promise<void> => {
  // Save a token that expire after config.sessionDurationHours hours if user is logged
  if (req.body.token) {
    const token = DOMPurify.sanitize(req.body.token);
    const dbToken = await dbLoginToken.getByToken(token);

    if (dbToken) {
      const psychologistData = await dbPsychologists.getAcceptedByEmail(dbToken.email);
      const xsrfToken = loginInformations.generateToken();
      cookie.createAndSetJwtCookie(res, psychologistData.dossierNumber, xsrfToken, 'psy');
      console.log(`Successful authentication for ${logs.hash(dbToken.email)}`);

      dbLoginToken.delete(token); // Psy tokens are single-use
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
      cookie.createAndSetJwtCookie(res, studentData.id, xsrfToken, 'student');
      console.log(`Successful authentication for ${logs.hash(dbToken.email)}`);

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
 * Security: Always return the same message to prevent user enumeration
 */
const sendMail = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { email } = req.body;

  console.log(`User with ${logs.hash(email)} asked for a login link`);
  const acceptedEmailExist = await dbPsychologists.getAcceptedByEmail(email);

  if (acceptedEmailExist) {
    const token = loginInformations.generateToken(32);
    const loginUrl = loginInformations.generateLoginUrl();
    await sendPsyLoginEmail(email, loginUrl, token);
    await savePsyToken(email, token);
  } else {
    const notYetAcceptedEmailExist = await dbPsychologists.getNotYetAcceptedByEmail(email);
    if (notYetAcceptedEmailExist) {
      await sendNotYetAcceptedEmail(email);
    } else {
      console.warn(`Email inconnu -ou sans suite ou refusé- qui essaye d'accéder au service : ${
        logs.hash(email)}
      `);
    }
  }

  // Security: Always return the same message regardless of email existence
  res.json({
    message: `Un email de connexion vient de vous être envoyé si votre adresse email 
      correspond bien à un utilisateur inscrit sur Santé Psy Étudiant. 
      Le lien est valable ${config.sessionDurationHours} heures.`,
  });
};

const sendStudentMail = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { email } = req.body;

  console.log(`Student with ${logs.hash(email)} asked for a login link`);
  const studentIsRegistered = await dbStudents.getByEmail(email);
  const token = loginInformations.generateToken(32);

  if (studentIsRegistered) {
    const loginUrl = loginInformations.generateLoginUrl();
    await saveStudentToken(email, token);
    await sendStudentLoginEmail(email, loginUrl, token);
  }

  res.json({
    message: `Un email de connexion vient de vous être envoyé si votre adresse email 
      correspond bien à un utilisateur inscrit sur Santé Psy Étudiant. 
      Le lien est valable ${config.sessionDurationHours} heures.`,
  });
};

const sendUserLoginMail = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { email } = req.body;

  console.log(`User login link request for ${logs.hash(email)}`);

  const student = await dbStudents.getByEmail(email);
  if (student) {
    await sendStudentMail(req, res);
    return;
  }

  const psy = await dbPsychologists.getAcceptedByEmail(email);

  if (psy) {
    await sendMail(req, res);
    return;
  }

  res.json({
    message: `Un email de connexion vient de vous être envoyé si votre adresse email 
      correspond bien à un utilisateur inscrit sur Santé Psy Étudiant. 
      Le lien est valable ${config.sessionDurationHours} heures.`,
  });
};

const userLogin = async (req: Request, res: Response): Promise<void> => {
  const token = DOMPurify.sanitize(req.body.token);

  if (!token) {
    throw new CustomError('Token manquant.', 400);
  }

  const tokenData = await dbLoginToken.getByToken(token);

  if (!tokenData) {
    throw new CustomError(
      'Ce lien est invalide ou expiré. Indiquez votre email ci-dessous pour en avoir un nouveau.',
      401,
    );
  }

  const { email, role } = tokenData;
  const xsrfToken = loginInformations.generateToken();

  if (role === 'psy') {
    const psy = await dbPsychologists.getAcceptedByEmail(email);
    if (psy) {
      cookie.createAndSetJwtCookie(res, psy.dossierNumber, xsrfToken, 'psy');
      console.log(`Successful authentication for psy ${logs.hash(email)}`);

      await dbLoginToken.delete(token); // Psy tokens are single-use
      await dbLastConnection.upsert(psy.dossierNumber);

      res.json({ xsrfToken, role: 'psy' });
      return;
    }
  } else if (role === 'student') {
    const student = await dbStudents.getByEmail(email);
    if (student) {
      cookie.createAndSetJwtCookie(res, student.id, xsrfToken, 'student');
      console.log(`Successful authentication for student ${logs.hash(email)}`);

      res.json({ xsrfToken, role: 'student' });
      return;
    }
  }

  console.log(`Token without matching user : ${logs.hash(email)}, role: ${role}`);

  throw new CustomError(
    'Ce lien est invalide ou expiré. Indiquez votre email ci-dessous pour en avoir un nouveau.',
    401,
  );
};

const userConnected = async (req: Request, res: Response): Promise<void> => {
  const tokenData = cookie.verifyJwt(req, res);

  if (!tokenData || !checkXsrf(req, tokenData.xsrfToken)) {
    res.json({ role: null, user: null });
    return;
  }

  const userId = tokenData.userId || tokenData.psychologist;
  const { role } = tokenData;

  if (!userId) {
    res.json({ role: null, user: null });
    return;
  }

  if (role === 'psy') {
    const psy = await dbPsychologists.getById(userId);
    if (psy) {
      const convention = await dbPsychologists.getConventionInfo(userId);
      const { reason: inactiveReason, until: inactiveUntil } = psy.active
        ? { reason: undefined, until: undefined }
        : await dbSuspensions.getByPsychologist(psy.dossierNumber);

      res.json({
        role: 'psy',
        user: {
          dossierNumber: psy.dossierNumber,
          firstNames: psy.firstNames,
          lastName: psy.lastName,
          useFirstNames: psy.useFirstNames,
          useLastName: psy.useLastName,
          adeli: psy.adeli,
          address: psy.address,
          otherAddress: psy.otherAddress,
          email: psy.email,
          convention,
          active: psy.active,
          hasSeenTutorial: psy.hasSeenTutorial,
          createdAt: psy.createdAt,
          inactiveReason,
          inactiveUntil,
        },
      });
      return;
    }
  } else if (role === 'student') {
    const student = await dbStudents.getById(userId);
    if (student) {
      res.json({
        role: 'student',
        user: { ...student },
      });
      return;
    }
  } else {
    // Backward compatibility: check both tables if role is missing
    const psy = await dbPsychologists.getById(userId);
    if (psy) {
      const convention = await dbPsychologists.getConventionInfo(userId);
      const { reason: inactiveReason, until: inactiveUntil } = psy.active
        ? { reason: undefined, until: undefined }
        : await dbSuspensions.getByPsychologist(psy.dossierNumber);

      res.json({
        role: 'psy',
        user: {
          dossierNumber: psy.dossierNumber,
          firstNames: psy.firstNames,
          lastName: psy.lastName,
          useFirstNames: psy.useFirstNames,
          useLastName: psy.useLastName,
          adeli: psy.adeli,
          address: psy.address,
          otherAddress: psy.otherAddress,
          email: psy.email,
          convention,
          active: psy.active,
          hasSeenTutorial: psy.hasSeenTutorial,
          createdAt: psy.createdAt,
          inactiveReason,
          inactiveUntil,
        },
      });
      return;
    }

    const isStudent = await dbStudents.getById(userId);
    if (isStudent) {
      res.json({
        role: 'student',
        user: { ...isStudent },
      });
      return;
    }
  }

  res.json({ role: null, user: null });
};

export default {
  emailValidators,
  login: asyncHelper(login),
  studentLogin: asyncHelper(studentLogin),
  sendMail: asyncHelper(sendMail),
  sendStudentMail: asyncHelper(sendStudentMail),
  sendStudentLoginEmail,
  deleteToken: asyncHelper(deleteToken),
  sendUserLoginMail: asyncHelper(sendUserLoginMail),
  userLogin: asyncHelper(userLogin),
  userConnected: asyncHelper(userConnected),
};
