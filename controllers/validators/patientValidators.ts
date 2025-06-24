import { check, oneOf } from 'express-validator';
import DOMPurify from '../../services/sanitizer';
import { allGenders } from '../../types/Genders';
import date from '../../utils/date';

export const patientValidators = [
  check('firstNames')
    .trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier le.s prénom.s du patient.'),
  check('lastName')
    .trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier le nom du patient.'),
  check('gender')
    .trim().not().isEmpty()
    .withMessage('Vous devez spécifier le genre du patient.')
    .customSanitizer(DOMPurify.sanitize)
    .isIn(allGenders)
    .withMessage('Le genre du patient n\'est pas valide.'),
  check('INE')
    .trim().not().isEmpty()
    .withMessage('Le numéro INE est obligatoire.')
    .isAlphanumeric()
    .withMessage('Le numéro INE doit être alphanumérique (chiffres ou lettres sans accents).')
    .isLength({ min: 11, max: 11 })
    .withMessage('Le numéro INE doit faire exactement 11 caractères.')
    .customSanitizer(DOMPurify.sanitize),
  check('dateOfBirth')
    .trim().isDate({ format: date.formatFrenchDateForm })
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('La date de naissance n\'est pas valide, le format doit être JJ/MM/AAAA.'),
  check('institutionName')
    .trim()
    .customSanitizer(DOMPurify.sanitize),
  oneOf([
    check('doctorName').trim().isEmpty(),
    check('doctorName')
      .trim()
      .customSanitizer(DOMPurify.sanitize),
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
