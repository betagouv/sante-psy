import { Request, Response } from 'express';

import { check, oneOf } from 'express-validator';
import validation from '../utils/validation';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';

const getPsyProfile = async (req: Request, res: Response): Promise<void> => {
  const { psyId } = req.params;
  const psychologist = await dbPsychologists.getPsychologistById(psyId);
  if (!psychologist) {
    throw Error("Le psychologue n'existe pas.");
  }

  res.json({
    success: true,
    psychologist: {
      email: psychologist.email,
      address: psychologist.address,
      departement: psychologist.departement,
      region: psychologist.region,
      phone: psychologist.phone,
      website: psychologist.website,
      teleconsultation: psychologist.teleconsultation,
      description: psychologist.description,
      languages: psychologist.languages,
      personalEmail: psychologist.personalEmail,
    },
  });
};

const editPsyProfilValidators = [
  check('personalEmail')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
  check('address')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage("Vous devez spécifier l'adresse de votre cabinet."),
  check('departement')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier votre département.'),
  check('region')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier votre région.'),
  check('phone')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier le téléphone du secrétariat.'),
  check('languages')
    .trim()
    .notEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier les langues parlées.'),
  oneOf(
    [
      // Two valid possibilities : email is empty, or email is valid format.
      check('email').trim().isEmpty(),
      check('email')
          .trim()
          .customSanitizer((value, { req }) => req.sanitize(value))
          .isEmail(),
    ], 'Vous devez spécifier un email valide.',
  ),
  check('description')
    .trim()
    .customSanitizer((value, { req }) => req.sanitize(value)),
  oneOf(
    [
      // Two valid possibilities : website is empty, or website is valid format.
      check('website').trim().isEmpty(),
      check('website')
            .trim()
            .customSanitizer((value, { req }) => req.sanitize(value))
            .isURL(),
    ], 'Vous devez spécifier une URL valide.',
  ),
  check('teleconsultation')
    .isBoolean()
    .withMessage('Vous devez spécifier si vous proposez la téléconsultation.'),
];

const editPsyProfile = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  await dbPsychologists.updatePsychologist({
    dossierNumber: req.params.psyId,
    ...req.body,
  });

  res.json({
    success: true,
    message: 'Vos informations ont bien été mises à jour.',
  });
};

export default {
  editPsyProfilValidators,
  getPsyProfile: asyncHelper(getPsyProfile),
  editPsyProfile: asyncHelper(editPsyProfile),
};
