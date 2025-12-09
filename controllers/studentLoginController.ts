import { Request, Response } from 'express';

import ejs from 'ejs';
import validation from '../utils/validation';
import dbStudents from '../db/students';
import dbLoginToken from '../db/studentLoginToken';
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

async function saveStudentToken(email: string, token: string): Promise<void> {
  try {
    const expiresAt = date.getDatePlusTwoHours();
    await dbLoginToken.insert(token, email, expiresAt);

    console.log(`Login token created for ${logs.hash(email)}`);
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}

const connectedStudent = async (req: Request, res: Response): Promise<void> => {
  const tokenData = cookie.verifyJwt(req, res);
  if (tokenData && checkXsrf(req, tokenData.xsrfToken)) {
    const student = await dbStudents.getStudentById(tokenData.psychologist);

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

const studentLogin = async (req: Request, res: Response): Promise<void> => {
  if (req.body.token) {
    const token = DOMPurify.sanitize(req.body.token);
    const dbToken = await dbLoginToken.getStudentByToken(token);

    if (dbToken) {
      const studentData = await dbStudents.getStudentByEmail(dbToken.email);
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

const sendStudentMail = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { email } = req.body;

  console.log(`Student with ${logs.hash(email)} asked for a login link`);
  const studentIsRegistered = await dbStudents.getStudentByEmail(email);
  const existingToken = await dbLoginToken.getStudentByEmail(email);
  let token;

  if (existingToken) {
    token = existingToken.token;
  } else {
    token = loginInformations.generateToken(32);
  }

  if (studentIsRegistered) {
    const loginUrl = loginInformations.generateStudentLoginUrl();
    await sendStudentLoginEmail(email, loginUrl, token);
    await saveStudentToken(email, token);
  }

  res.json({});
};

export default {
  sendStudentLoginEmail,
  connectedStudent: asyncHelper(connectedStudent),
  studentLogin: asyncHelper(studentLogin),
  sendStudentMail: asyncHelper(sendStudentMail),
};
