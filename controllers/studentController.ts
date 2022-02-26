import { Request, Response } from 'express';
import { check, oneOf } from 'express-validator';
import dbStudents from '../db/students';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';
import { sendMail1 } from '../services/studentMails';

const mailValidator = [
  check('email')
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
];

const sendStudentMail = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { email } = req.body;
  await sendMail1(email);

  res.json({
    // eslint-disable-next-line max-len
    message: 'Nous vous avons envoyé un mail avec toutes les informations sur le dispositif. Pensez à verifier vos spams et n\'hesitez pas à nous contacter en cas de problèmes',
  });

  dbStudents.insert(email);
};

const answerValidator = [
  check('id').isUUID().withMessage('Votre identifiant est invalide.'),
  check('letter', 'Vous devez spécifier un booléen').optional().isBoolean(),
  check('appointment', 'Vous devez spécifier un booléen').optional().isBoolean(),
  check('referral', 'Vous devez spécifier un nombre entre 1 et 5').optional().isInt({ min: 1, max: 5 }),
  oneOf([
    check('letter').exists(),
    check('appointment').exists(),
    check('referral').exists(),
  ], 'Une et une seule réponse doit être envoyée'),
];

const saveAnswer = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const {
    id, letter, appointment, referral,
  } = req.body;
  dbStudents.updateById(id, { letter, appointment, referral });

  res.json({ message: 'Réponse enregistrée' });
};

export default {
  mailValidator,
  sendStudentMail: asyncHelper(sendStudentMail),
  answerValidator,
  saveAnswer: asyncHelper(saveAnswer),
};
