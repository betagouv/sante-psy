import { Request, Response } from 'express';
import { check } from 'express-validator';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';
import { purifySanitizer } from '../services/sanitizer';
import dbStudents from '../db/students';
import { inePatterns } from './validators/patientValidators';

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
  case 'created':
    res.status(201).json({ status: 'created' });
    break;

  case 'alreadyRegistered':
    res.status(200).json({ status: 'alreadyRegistered' });
    break;

  case 'accountNotValidated':
    res.status(200).json({ status: 'accountNotValidated' });
    break;

  case 'conflict':
    res.status(409).json({ status: 'conflict' });
    break;

  default:
    res.status(500).json({ status: 'error' });
    break;
  }
};

export default {
  signInValidator,
  signIn: asyncHelper(signIn),
};
