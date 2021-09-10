import { Request, Response } from 'express';
import { check, param, oneOf } from 'express-validator';
import DOMPurify from '../services/sanitizer';

import geo from '../utils/geo';
import validation from '../utils/validation';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import cookie from '../utils/cookie';
import string from '../utils/string';
import getAddressCoordinates from '../services/getAddressCoordinates';
import { Coordinates } from '../types/Coordinates';

const getValidators = [
  param('psyId')
    .isUUID()
    .withMessage('Vous devez spécifier un identifiant valide.'),
];

const get = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const psychologist = await dbPsychologists.getById(req.params.psyId);
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
    website: string.prefixUrl(psychologist.website),
    teleconsultation: psychologist.teleconsultation,
    description: psychologist.description,
    languages: psychologist.languages,
    personalEmail: extraInfo ? psychologist.personalEmail : undefined,
    active: psychologist.active,
  });
};

const updateValidators = [
  check('personalEmail')
    .trim()
    .notEmpty()
    .withMessage('Vous devez spécifier un email valide.')
    .customSanitizer(DOMPurify.sanitize)
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
  check('address')
    .trim()
    .notEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage("Vous devez spécifier l'adresse de votre cabinet."),
  check('departement')
    .trim()
    .notEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier votre département.'),
  check('phone')
    .trim()
    .notEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier le téléphone du secrétariat.'),
  check('languages')
    .trim()
    .notEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier les langues parlées.'),
  oneOf(
    [
      // Two valid possibilities : email is empty, or email is valid format.
      check('email').trim().isEmpty(),
      check('email')
          .trim()
          .customSanitizer(DOMPurify.sanitize)
          .isEmail(),
    ], 'Vous devez spécifier un email valide.',
  ),
  check('description')
    .trim()
    .customSanitizer(DOMPurify.sanitize),
  oneOf(
    [
      // Two valid possibilities : website is empty, or website is valid format.
      check('website').trim().isEmpty(),
      check('website')
            .trim()
            .customSanitizer(DOMPurify.sanitize)
            .isURL(),
    ], 'Vous devez spécifier une URL valide.',
  ),
  check('teleconsultation')
    .isBoolean()
    .withMessage('Vous devez spécifier si vous proposez la téléconsultation.'),
];

const update = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const region = geo.departementToRegion[req.body.departement];
  if (!region) {
    throw new CustomError('Departement invalide', 400);
  }

  let coordinates : Coordinates;
  const psychologist = await dbPsychologists.getById(req.user.psychologist);
  if (psychologist && psychologist.address !== req.body.address) {
    coordinates = await getAddressCoordinates(req.body.address);
  }

  await dbPsychologists.update({
    ...req.body,
    dossierNumber: req.user.psychologist,
    region,
    ...(coordinates && {
      longitude: coordinates.longitude,
      latitude: coordinates.latitude,
    }),
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
    .withMessage('Vous devez spécifier une date de fin de suspension dans le futur.')
    .isAfter()
    .withMessage('Vous devez spécifier une date de fin de suspension dans le futur.'),
  check('reason')
    .trim().not().isEmpty()
    .withMessage('Vous devez spécifier une raison.')
    .customSanitizer(DOMPurify.sanitize)
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
  getValidators,
  updateValidators,
  suspendValidators,
  get: asyncHelper(get),
  update: asyncHelper(update),
  activate: asyncHelper(activate),
  suspend: asyncHelper(suspend),
};
