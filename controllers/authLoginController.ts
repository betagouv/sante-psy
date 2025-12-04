import { Request, Response } from 'express';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';

import dbStudents from '../db/students';
import dbPsychologists from '../db/psychologists';
import dbPsyLoginToken from '../db/psyLoginToken';
import dbStudentLoginToken from '../db/studentLoginToken';
import dbLastConnection from '../db/lastConnections';

import psyController from './psyLoginController';
import studentLoginController from './studentLoginController';
import config from '../utils/config';
import DOMPurify from '../services/sanitizer';
import CustomError from '../utils/CustomError';
import loginInformations from '../services/loginInformations';
import cookie from '../utils/cookie';
import logs from '../utils/logs';
import { checkXsrf } from '../middlewares/xsrfProtection';

const sendUserLoginMail = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { email } = req.body;

  console.log(`User login link request for ${email}`);

  const student = await dbStudents.getStudentByEmail(email);
  if (student) {
    studentLoginController.sendStudentMail(req, res, () => {});
    return;
  }

  const psy = await dbPsychologists.getAcceptedByEmail(email);

  if (psy) {
    psyController.sendPsyMail(req, res, () => {});
    return;
  }

  res.json({
    message: `Un mail de connexion vient de vous être envoyé si votre adresse e-mail 
        correspond bien à un utilisateur inscrit sur Santé Psy Étudiant. 
        Le lien est valable ${config.sessionDurationHours} heures.`,
  });
};

const userLogin = async (req: Request, res: Response): Promise<void> => {
  const token = DOMPurify.sanitize(req.body.token);

  if (!token) {
    throw new CustomError('Token manquant.', 400);
  }

  const psyToken = await dbPsyLoginToken.getPsyByToken(token);
  if (psyToken) {
    const psy = await dbPsychologists.getAcceptedByEmail(psyToken.email);
    const xsrfToken = loginInformations.generateToken();

    cookie.createAndSetJwtCookie(res, psy.dossierNumber, xsrfToken);
    console.log(`Successful authentication for psy ${logs.hash(psyToken.email)}`);

    await dbPsyLoginToken.delete(token);
    await dbLastConnection.upsert(psy.dossierNumber);

    res.json({ xsrfToken, role: 'psy' });
    return;
  }

  const studentToken = await dbStudentLoginToken.getStudentByToken(token);
  if (studentToken) {
    const student = await dbStudents.getStudentByEmail(studentToken.email);
    const xsrfToken = loginInformations.generateToken();

    cookie.createAndSetJwtCookie(res, student.id, xsrfToken);
    console.log(`Successful authentication for student ${logs.hash(studentToken.email)}`);

    await dbStudentLoginToken.delete(token);

    res.json({ xsrfToken, role: 'student' });
    return;
  }

  console.log(`Invalid or expired token received : ${token.substring(0, 5)}...`);
  throw new CustomError(
    'Ce lien est invalide ou expiré. Indiquez votre email ci-dessous pour en avoir un nouveau.',
    401,
  );
};

const userConnected = async (req: Request, res: Response): Promise<any> => {
  const tokenData = cookie.verifyJwt(req, res);
  if (!tokenData || !checkXsrf(req, tokenData.xsrfToken)) {
    return res.json({ role: null, user: null });
  }

  const { psychologist } = tokenData;

  const isPsy = await dbPsychologists.getById(psychologist);
  const isStudent = await dbStudents.getStudentById(psychologist);

  if (isPsy) {
    const convention = await dbPsychologists.getConventionInfo(psychologist);
    return res.json({
      role: 'psy',
      user: { ...isPsy, convention },
    });
  }

  if (isStudent) {
    return res.json({
      role: 'student',
      user: { ...isStudent },
    });
  }

  return res.json({ role: null, user: null });
};

export default {
  sendUserLoginMail: asyncHelper(sendUserLoginMail),
  userLogin: asyncHelper(userLogin),
  userConnected: asyncHelper(userConnected),
};
