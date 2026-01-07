import { check, oneOf } from 'express-validator';
import { purifySanitizer } from '../../services/sanitizer';
import { allGenders } from '../../types/Genders';
import date from '../../utils/date';

const inePatterns = [
  /^[0-9]{9}[A-HJK]{2}$/, // INE-RNIE
  /^\d{10}[A-HJ-NPR-Z]$/, // INE-BEA
  /^[0-9A-Z]{10}\d$/, // INE-Base 36
  /^\d{4}[A]\d{5}[A-HJ-NPR-Z]$/, // INE-SIFA
  /^\d{4}[D]\d{5}[A-HJ-NPR-Z]$/i, // INE provisoire
];

export const patientValidators = [
  check('firstNames')
    .trim().not().isEmpty()
    .customSanitizer(purifySanitizer)
    .withMessage('Vous devez spécifier le.s prénom.s du patient.'),
  check('lastName')
    .trim().not().isEmpty()
    .customSanitizer(purifySanitizer)
    .withMessage('Vous devez spécifier le nom du patient.'),
  check('gender')
    .trim().not().isEmpty()
    .withMessage('Vous devez spécifier le genre du patient.')
    .customSanitizer(purifySanitizer)
    .isIn(allGenders)
    .withMessage('Le genre du patient n\'est pas valide.'),
  check('email')
    .trim().not().isEmpty()
    .withMessage('Vous devez spécifier un email valide.')
    .isEmail()
    .customSanitizer(purifySanitizer)
    .withMessage('Email invalide.'),
  check('INE')
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
  check('institutionName')
    .trim()
    .customSanitizer(purifySanitizer),
  oneOf([
    check('doctorName').trim().isEmpty(),
    check('doctorName')
      .trim()
      .customSanitizer(purifySanitizer),
  ]),
];

export const updateValidators = [
  check('patientId')
    .trim().not().isEmpty()
    .withMessage('Ce patient n\'existe pas.')
    .isUUID()
    .withMessage('Ce patient n\'existe pas.'),
  ...patientValidators,
];

export const getOneValidators = [
  check('patientId')
    .trim().not().isEmpty()
    .withMessage('Ce patient n\'existe pas.')
    .isUUID()
    .withMessage('Ce patient n\'existe pas.'),
];

export const deleteValidators = [
  check('patientId')
    .isUUID()
    .withMessage('Vous devez spécifier un étudiant à supprimer.'),
];
