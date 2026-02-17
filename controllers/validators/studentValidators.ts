import { check } from 'express-validator';
import { inePatterns } from './patientValidators';
import { purifySanitizer } from '../../services/sanitizer';
import date from '../../utils/date';

export const emailValidator = [
  check('email').isEmail().withMessage('Vous devez spécifier un email valide.'),
];

export const signInValidator = [
  check('email').isEmail().withMessage('Vous devez spécifier un email valide.'),
  check('firstNames')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Le prénom est obligatoire.')
    .customSanitizer(purifySanitizer),
  check('lastName')
    .trim().not().isEmpty()
    .customSanitizer(purifySanitizer)
    .withMessage('Le nom est obligatoire'),
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
  check('dateOfBirth')
    .trim().isDate({ format: date.formatFrenchDateForm })
    .customSanitizer(purifySanitizer)
    .withMessage('La date de naissance n\'est pas valide, le format doit être JJ/MM/AAAA.')
    .custom((value) => {
      const [day, month, year] = value.split('/').map(Number);
      const birthDate = new Date(year, month - 1, day);
      const now = new Date();
      const minAllowedDate = new Date(
        now.getFullYear() - 15,
        now.getMonth(),
        now.getDate(),
      );
      if (birthDate > minAllowedDate) {
        throw new Error('La date de naissance n\'est pas valide.');
      }
      return true;
    }),
];
