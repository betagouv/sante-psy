import { Request, Response } from 'express';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';

import dbStudents from '../db/students';
import dbPsychologists from '../db/psychologists';

import psyController from './psyLoginController';
import studentLoginController from './studentLoginController';
import config from '../utils/config';

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

export default {
  sendUserLoginMail: asyncHelper(sendUserLoginMail),
};
