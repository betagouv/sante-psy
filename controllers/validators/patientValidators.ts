import { check } from 'express-validator';

export const patientValidators = [
  check('studentId')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Ce patient n'existe pas.")
    .isUUID()
    .withMessage("Ce patient n'existe pas."),
];

export const getOneValidators = [
  check('patientId')
    .trim()
    .not()
    .isEmpty()
    .withMessage("Ce patient n'existe pas.")
    .isUUID()
    .withMessage("Ce patient n'existe pas."),
];

export const deleteValidators = [
  check('patientId')
    .isUUID()
    .withMessage('Vous devez spécifier un étudiant à supprimer.'),
];
