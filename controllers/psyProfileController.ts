import { Request, Response } from 'express';

import { check, param, oneOf } from 'express-validator';
import geo from '../utils/geo';
import validation from '../utils/validation';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import cookie from '../utils/cookie';

const getPsyProfilValidators = [
  param('psyId')
    .isUUID()
    .withMessage('Vous devez spécifier un identifiant valide.'),
];

const getPsyProfile = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const psychologist = await dbPsychologists.getPsychologistById(req.params.psyId);
  if (!psychologist) {
    throw new CustomError("Le psychologue n'existe pas.", 500);
  }
  const tokenData = cookie.verifyJwt(req, res);
  const extraInfo = tokenData && tokenData.psychologist === req.params.psyId;

  res.json({
    firstNames: psychologist.firstNames,
    lastName: psychologist.lastName,
    email: psychologist.email,
    address: psychologist.address,
    departement: psychologist.departement,
    region: psychologist.region,
    phone: psychologist.phone,
    website: psychologist.website,
    teleconsultation: psychologist.teleconsultation,
    description: psychologist.description,
    languages: psychologist.languages,
    personalEmail: extraInfo ? psychologist.personalEmail : undefined,
    active: psychologist.active,
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

  const region = geo.departementToRegion[req.body.departement];
  if (!region) {
    throw new CustomError('Departement invalide', 400);
  }

  await dbPsychologists.updatePsychologist({
    ...req.body,
    dossierNumber: req.user.psychologist,
    region,
  });

  res.json({
    message: 'Vos informations ont bien été mises à jour.',
  });
};

const activate = async (req: Request, res: Response): Promise<void> => {
  await dbPsychologists.activate(req.user.psychologist);

  res.json({
    message: 'Vos informations sont de nouveau visibles sur l\'annuaire.',
  });
};

const suspendValidators = [
  check('date')
    .isISO8601()
    .isAfter()
    .withMessage('Vous devez spécifier une date de fin de suspension dans le futur.'),
  check('reason')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier une raison.'),
];

const suspend = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  await dbPsychologists.suspend(req.user.psychologist, req.body.date, req.body.reason);

  res.json({
    message: 'Vos informations ne sont plus visibles sur l\'annuaire.',
  });
};

export default {
  getPsyProfilValidators,
  editPsyProfilValidators,
  suspendValidators,
  getPsyProfile: asyncHelper(getPsyProfile),
  editPsyProfile: asyncHelper(editPsyProfile),
  activate: asyncHelper(activate),
  suspend: asyncHelper(suspend),
};
