import { Request, Response } from 'express';

import crypto from 'crypto';
import { check } from 'express-validator';
import ejs from 'ejs';
import validation from '../utils/validation';
import dbPsychologists from '../db/psychologists';
import dbLoginToken from '../db/loginToken';
import dbLastConnection from '../db/lastConnections';
import date from '../utils/date';
import cookie from '../utils/cookie';
import logs from '../utils/logs';
import emailUtils from '../utils/email';
import config from '../utils/config';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import { checkXsrf } from '../middlewares/xsrfProtection';

const emailValidators = [
  check('email')
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
];

/**
 * @see https://www.ssi.gouv.fr/administration/precautions-elementaires/calculer-la-force-dun-mot-de-passe/
 */
function generateToken() {
  return crypto.randomBytes(64).toString('hex');
}

async function sendLoginEmail(email: string, loginUrl: string, token: string) {
  try {
    const html = await ejs.renderFile('./views/emails/login.ejs', {
      loginUrlWithToken: `${loginUrl}/${encodeURIComponent(token)}`,
      appName: config.appName,
      loginUrl,
    });
    await emailUtils.sendMail(email, `Connexion à ${config.appName}`, html);
    console.log(`Login email sent for ${logs.hashForLogs(email)}`);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail - sendLoginEmail");
  }
}

async function sendNotYetAcceptedEmail(email: string) {
  try {
    const html = await ejs.renderFile('./views/emails/loginNotAcceptedYet.ejs', {
      appName: config.appName,
    });
    await emailUtils.sendMail(email, `C'est trop tôt pour vous connecter à ${config.appName}`, html);
    console.log(`Not yet accepted email sent for ${logs.hashForLogs(email)}`);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail - sendNotYetAcceptedEmail");
  }
}

async function saveToken(email: string, token: string) {
  try {
    const expiredAt = date.getDatePlusOneHour();
    await dbLoginToken.insert(token, email, expiredAt);

    console.log(`Login token created for ${logs.hashForLogs(email)}`);
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}

const deleteToken = (req: Request, res: Response): void => {
  cookie.clearJwtCookie(res);
  res.json({ });
};

const connectedUser = async (req: Request, res: Response): Promise<void> => {
  const tokenData = cookie.verifyJwt(req, res);
  if (checkXsrf(req, tokenData.xsrfToken)) {
    const psy = await dbPsychologists.getById(tokenData.psychologist);
    const convention = await dbPsychologists.getConventionInfo(tokenData.psychologist);

    if (psy) {
      const {
        dossierNumber, firstNames, lastName, email, active, adeli, address,
      } = psy;
      res.json({
        dossierNumber,
        firstNames,
        lastName,
        adeli,
        address,
        email,
        convention,
        active,
      });

      return;
    }
  }

  res.json();
};

const login = async (req: Request, res: Response): Promise<void> => {
  // Save a token that expire after config.sessionDurationHours hours if user is logged
  if (req.body.token) {
    const token = req.sanitize(req.body.token);
    const dbToken = await dbLoginToken.getByToken(token);

    if (dbToken) {
      const psychologistData = await dbPsychologists.getAcceptedByEmail(dbToken.email);
      const xsrfToken = crypto.randomBytes(64).toString('hex');
      cookie.createAndSetJwtCookie(res, psychologistData.dossierNumber, xsrfToken);
      console.log(`Successful authentication for ${logs.hashForLogs(dbToken.email)}`);

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

function generateLoginUrl() {
  return `${config.hostnameWithProtocol}/psychologue/login`;
}

/**
 * Send a email with a login link if the email is already registered
 */
const sendMail = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { email } = req.body;

  console.log(`User with ${logs.hashForLogs(email)} asked for a login link`);
  const acceptedEmailExist = await dbPsychologists.getAcceptedByEmail(email);

  if (!acceptedEmailExist) {
    const notYetAcceptedEmailExist = await dbPsychologists.getNotYetAcceptedByEmail(email);
    if (notYetAcceptedEmailExist) {
      await sendNotYetAcceptedEmail(email);
      throw new CustomError(
        'Votre compte n\'est pas encore validé par nos services, veuillez rééssayer plus tard.',
        401,
      );
    }

    console.warn(`Email inconnu -ou sans suite ou refusé- qui essaye d'accéder au service : ${
      logs.hashForLogs(email)}
    `);
    throw new CustomError(
      `L'email ${email} est inconnu, ou est lié à un dossier classé sans suite ou refusé.`,
      401,
    );
  }

  const token = generateToken();
  const loginUrl = generateLoginUrl();
  await sendLoginEmail(email, loginUrl, token);
  await saveToken(email, token);
  res.json({
    message: `Un lien de connexion a été envoyé à l'adresse ${email
    }. Le lien est valable ${config.sessionDurationHours} heures.`,
  });
};

export default {
  emailValidators,
  connectedUser: asyncHelper(connectedUser),
  login: asyncHelper(login),
  sendMail: asyncHelper(sendMail),
  deleteToken,
};
