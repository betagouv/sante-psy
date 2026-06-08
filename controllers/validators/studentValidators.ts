import { check } from 'express-validator';
import {
  checkDateOfBirth,
  checkFirstName,
  checkIne,
  checkLastName,
} from './common';

export const emailValidator = [
  check('email')
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.')
    .custom((value) => {
      if (value.toLowerCase().includes('santepsyetudiant')) {
        throw new Error(
          "Cette adresse email n'est pas autorisée à créer un compte étudiant.",
        );
      }
      return true;
    }),
];

export const signInValidator = [
  check('email')
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.')
    .custom((value) => {
      if (value.toLowerCase().includes('santepsyetudiant')) {
        throw new Error(
          "Cette adresse email n'est pas autorisée à créer un compte étudiant.",
        );
      }
      return true;
    }),
  checkFirstName,
  checkLastName,
  checkIne,
  checkDateOfBirth,
];
