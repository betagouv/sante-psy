import { check } from 'express-validator';
import { purifySanitizer } from '../../services/sanitizer';
import date from '../../utils/date';

export const inePatterns = [
  /^[0-9]{9}[A-HJK]{2}$/, // INE-RNIE
  /^\d{10}[A-HJ-NPR-Z]$/, // INE-BEA
  /^[0-9A-Z]{10}\d$/, // INE-Base 36
  /^\d{4}[A]\d{5}[A-HJ-NPR-Z]$/, // INE-SIFA
  /^\d{4}[D]\d{5}[A-HJ-NPR-Z]$/i, // INE provisoire
];

export const checkFirstName = check('firstNames')
  .isString()
  .trim()
  .notEmpty()
  .withMessage('Le prénom est obligatoire.')
  .customSanitizer(purifySanitizer);

export const checkLastName = check('lastName')
  .trim()
  .not()
  .isEmpty()
  .customSanitizer(purifySanitizer)
  .withMessage('Le nom est obligatoire');

export const checkDateOfBirth = check('dateOfBirth')
  .trim()
  .isDate({ format: date.formatFrenchDateForm })
  .customSanitizer(purifySanitizer)
  .withMessage(
    "La date de naissance n'est pas valide, le format doit être JJ/MM/AAAA.",
  )
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
      throw new Error("La date de naissance n'est pas valide.");
    }
    return true;
  })
  .customSanitizer((value) => {
    // Convertit JJ/MM/AAAA → YYYY-MM-DD pour la DB
    const [day, month, year] = value.split('/');
    return `${year}-${month}-${day}`;
  });

export const checkIne = check('ine')
  .trim()
  .notEmpty()
  .withMessage('Le numéro INE est obligatoire.')
  .customSanitizer(purifySanitizer)
  .custom((value) => {
    const isValid = inePatterns.some((pattern) => pattern.test(value));
    if (!isValid)
      throw new Error(
        'Le numéro INE est invalide. Veuillez vérifier le format.',
      );
    return true;
  });
