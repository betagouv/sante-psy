import { Request, Response } from 'express';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';

import dbStudents from '../db/students';
import dbSuspensions from '../db/suspensionReasons';
import dbPsychologists from '../db/psychologists';
import loginToken from '../db/loginToken';
import dbLastConnection from '../db/lastConnections';

import loginController from './loginController';
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

  const student = await dbStudents.getByEmail(email);
  if (student) {
    loginController.sendStudentMail(req, res, () => {});
    return;
  }

  const psy = await dbPsychologists.getAcceptedByEmail(email);

  if (psy) {
    loginController.sendMail(req, res, () => {});
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

  const tokenData = await loginToken.getByToken(token);

  if (!tokenData) {
    console.log(`Invalid or expired token received : ${token.substring(0, 5)}...`);
    throw new CustomError(
      'Ce lien est invalide ou expiré. Indiquez votre email ci-dessous pour en avoir un nouveau.',
      401,
    );
  }

  const { email } = tokenData;
  const xsrfToken = loginInformations.generateToken();

  const psy = await dbPsychologists.getAcceptedByEmail(email);
  if (psy) {
    cookie.createAndSetJwtCookie(res, psy.dossierNumber, xsrfToken);
    console.log(`Successful authentication for psy ${logs.hash(email)}`);

    await loginToken.delete(token);
    await dbLastConnection.upsert(psy.dossierNumber);

    res.json({ xsrfToken, role: 'psy' });
    return;
  }

  const student = await dbStudents.getByEmail(email);
  if (student) {
    cookie.createAndSetJwtCookie(res, student.id, xsrfToken);
    console.log(`Successful authentication for student ${logs.hash(email)}`);

    await loginToken.delete(token);

    res.json({ xsrfToken, role: 'student' });
    return;
  }

  console.log(`Token without matching user : ${logs.hash(email)}`);
  await loginToken.delete(token);

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

  const { psychologist } = tokenData;

  const psy = await dbPsychologists.getById(psychologist);
  const isStudent = await dbStudents.getById(psychologist);

  if (psy) {
    const convention = await dbPsychologists.getConventionInfo(psychologist);
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
  }

  if (isStudent) {
    res.json({
      role: 'student',
      user: { ...isStudent },
    });
    return;
  }

  res.json({ role: null, user: null });
};

export default {
  sendUserLoginMail: asyncHelper(sendUserLoginMail),
  userLogin: asyncHelper(userLogin),
  userConnected: asyncHelper(userConnected),
};
