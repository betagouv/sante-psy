import { check } from 'express-validator';
import { inePatterns } from './patientValidators';
import { purifySanitizer } from '../../services/sanitizer';

export const emailValidator = [
  check('email').isEmail().withMessage('Vous devez spécifier un email valide.'),
];

export const signInValidator = [
  check('firstNames')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Le prénom est obligatoire.')
    .customSanitizer(purifySanitizer),
  check('ine')
    .trim()
    .notEmpty()
    .withMessage('Le numéro INE est obligatoire.')
    .customSanitizer(purifySanitizer)
    .custom((value) => {
      const isValid = inePatterns.some((pattern) => pattern.test(value));
      if (!isValid) throw new Error('Le numéro INE est invalide. Veuillez vérifier le format.');
      return true;
    }),
  ...emailValidator,
];
