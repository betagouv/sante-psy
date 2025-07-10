import { Request, Response } from 'express';
import { check, oneOf } from 'express-validator';
import { purifySanitizer } from '../services/sanitizer';
import dbStudents from '../db/students';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';
import { sendMail1 } from '../services/studentMails';

const mailValidator = [
  check('email').isEmail().withMessage('Vous devez spécifier un email valide.'),
  check('source').customSanitizer(purifySanitizer),
];

const sendStudentMail = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { email, source } = req.body;
  await sendMail1(email);

  res.json({
    // eslint-disable-next-line max-len
    message: "Nous vous avons envoyé un mail avec toutes les informations sur le dispositif. Pensez à verifier vos spams et n'hésitez pas à nous contacter en cas de problèmes.",
  });

  dbStudents.insert(email, source);
};

const answerValidator = [
  check('id', 'Votre identifiant est invalide.').isUUID(),
  check('letter', 'Vous devez spécifier un booléen')
    .optional({ nullable: true })
    .isBoolean(),
  check('appointment', 'Vous devez spécifier un booléen')
    .optional({ nullable: true })
    .isBoolean(),
  check('referral', 'Vous devez spécifier un nombre entre 1 et 3')
      .optional({ nullable: true })
      .isInt({ min: 1, max: 3 }),
  check('doctorAppointment', 'Vous devez spécifier un booléen')
            .optional({ nullable: true })
            .isBoolean(),
  check('doctorAppointment2', 'Vous devez spécifier un booléen')
                  .optional({ nullable: true })
                  .isBoolean(),
  oneOf(
    [
      check('letter').exists(),
      check('appointment').exists(),
      check('referral').exists(),
      check('doctorAppointment').exists(),
      check('doctorAppointment2').exists(),
    ],
    'Une et une seule réponse doit être envoyée',
  ),
];

const saveAnswer = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const {
    id, letter, appointment, referral, doctorAppointment, doctorAppointment2,
  } = req.body;

  dbStudents.updateById(id, {
    letter: letter == null ? undefined : letter,
    appointment: appointment == null ? undefined : appointment,
    referral: referral == null ? undefined : referral,
    doctorAppointment: doctorAppointment == null ? undefined : doctorAppointment,
    doctorAppointment2: doctorAppointment2 == null ? undefined : doctorAppointment2,
  });

  res.json({ message: 'Ta réponse a bien été prise en compte.' });
};

const unregister = async (req: Request, res: Response): Promise<void> => {
  const { studentId } = req.params;

  dbStudents.updateById(studentId, {
    email: null,
  });

  res.send('Ok');
};

export default {
  mailValidator,
  sendStudentMail: asyncHelper(sendStudentMail),
  answerValidator,
  saveAnswer: asyncHelper(saveAnswer),
  unregister,
};
