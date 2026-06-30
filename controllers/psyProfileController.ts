import { Request, Response } from 'express';
import { check, param, oneOf } from 'express-validator';
import { purifySanitizer } from '../services/sanitizer';

import validation from '../utils/validation';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import cookie from '../utils/cookie';

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
  const userId = tokenData ? (tokenData.userId || tokenData.psychologist) : null;
  const extraInfo = tokenData && userId === req.params.psyId;

  if (!extraInfo && !psychologist.active) {
    throw new CustomError("Le psychologue n'existe pas.", 500);
  }

  const {
    firstNames,
    lastName,
    email,
    address,
    departement,
    region,
    phone,
    website,
    appointmentLink,
    teleconsultation,
    description,
    languages,
    active,
    longitude,
    latitude,
    city,
    postcode,
    otherAddress,
    otherLongitude,
    otherLatitude,
    otherCity,
    otherPostcode,
    useFirstNames,
    useLastName,
    adeli,
  } = psychologist;

  res.json({
    firstNames: useFirstNames || firstNames,
    lastName: useLastName || lastName,
    email,
    phone,
    website,
    appointmentLink,
    teleconsultation,
    description,
    languages,
    active,
    address,
    longitude,
    latitude,
    city,
    postcode,
    otherAddress,
    otherLongitude,
    otherLatitude,
    otherCity,
    otherPostcode,
    departement,
    region,
    personalEmail: extraInfo ? psychologist.personalEmail : undefined,
    adeli,
  });
};

const updateValidators = [
  check('personalEmail')
    .trim()
    .notEmpty()
    .withMessage('Vous devez spécifier un email valide.')
    .customSanitizer(purifySanitizer)
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
  check('address')
    .exists({ checkNull: true })
    .withMessage("Vous devez spécifier l'adresse de votre cabinet.")
    .bail()
    .isObject()
    .withMessage("L'adresse n'a pas un format valide."),
  check('address.postcode')
    .trim()
    .notEmpty()
    .withMessage('Vous devez spécifier le code postal de votre cabinet.'),
  check('otherAddress')
    .optional({ nullable: true })
    .isObject()
    .withMessage("L'adresse n'a pas un format valide."),
  check('phone')
    .trim()
    .notEmpty()
    .customSanitizer(purifySanitizer)
    .withMessage('Vous devez spécifier le téléphone du secrétariat.'),
  check('languages')
    .trim()
    .notEmpty()
    .customSanitizer(purifySanitizer)
    .withMessage('Vous devez spécifier les langues parlées.'),
  oneOf([
    // Two valid possibilities : email is empty, or email is valid format.
    check('email').trim().isEmpty(),
    check('email')
      .trim()
      .customSanitizer(purifySanitizer)
      .isEmail(),
  ], 'Vous devez spécifier un email valide.'),
  check('description')
    .trim()
    .customSanitizer(purifySanitizer),
  check('website')
    .trim()
    .customSanitizer(purifySanitizer),
  check('appointmentLink')
    .trim()
    .customSanitizer(purifySanitizer),
  check('teleconsultation')
    .isBoolean()
    .withMessage('Vous devez spécifier si vous proposez la téléconsultation.'),
];

const update = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const psychologistId = req.auth.userId || req.auth.psychologist;

  if (!psychologistId) {
    res.status(403).json({ message: 'Non autorisé' });
    return;
  }

  const { address, otherAddress, ...otherFields } = req.body;

  await dbPsychologists.update({
    ...otherFields,
    dossierNumber: psychologistId,
    ...(address && { ...address }),
    ...(otherAddress && {
      otherCity: otherAddress.city,
      otherPostcode: otherAddress.postcode,
      otherLongitude: otherAddress.longitude,
      otherLatitude: otherAddress.latitude,
      otherAddress: otherAddress.address,
    }),
  });

  res.json({
    message: 'Vos informations ont bien été mises à jour.',
  });
};

const activate = async (req: Request, res: Response): Promise<void> => {
  const psychologistId = req.auth.userId || req.auth.psychologist;

  if (!psychologistId) {
    res.status(403).json({ message: 'Non autorisé' });
    return;
  }

  await dbPsychologists.activate(psychologistId);

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
    .customSanitizer(purifySanitizer)
    .withMessage('Vous devez spécifier une raison.'),
];

const suspend = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const psychologistId = req.auth.userId || req.auth.psychologist;

  if (!psychologistId) {
    res.status(403).json({ message: 'Non autorisé' });
    return;
  }

  await dbPsychologists.suspend(psychologistId, req.body.date, req.body.reason);

  res.json({
    message: 'Vos informations ne sont plus visibles sur l\'annuaire.',
  });
};

const seeTutorial = async (req: Request, res: Response): Promise<void> => {
  const psychologistId = req.auth.userId || req.auth.psychologist;

  if (!psychologistId) {
    res.status(403).json({ message: 'Non autorisé' });
    return;
  }

  await dbPsychologists.seeTutorial(psychologistId);

  res.json({
    message: 'Tutorial vu !',
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
  seeTutorial: asyncHelper(seeTutorial),
};
