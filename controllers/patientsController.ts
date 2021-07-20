import { Request, Response } from 'express';

import { check, oneOf } from 'express-validator';
import dbPatients from '../db/patients';
import validation from '../utils/validation';
import date from '../utils/date';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';

const getAll = async (req: Request, res: Response): Promise<void> => {
  const psychologistId = req.user.psychologist;
  const patients = await dbPatients.getPatients(psychologistId);
  res.json(patients);
};

// Validators we reuse for editPatient and createPatient
const patientValidators = [
  // todo : do we html-escape here ? We already escape in templates.
  check('firstNames')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier le.s prénom.s du patient.'),
  check('lastName')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier le nom du patient.'),
  oneOf(
    [
      // Two valid possibilities : ine is empty, or ine is valid format.
      check('INE').trim().isEmpty(),
      check('INE')
        .trim().isAlphanumeric()
        .isLength({ min: 1, max: 50 })
        .customSanitizer((value, { req }) => req.sanitize(value)),
    ],
    `Le numéro INE doit faire maximum 50 caractères alphanumériques \
(chiffres ou lettres sans accents).
    Si vous ne l'avez pas maintenant, ce n'est pas grave, vous pourrez y revenir plus tard.`,
  ),
  oneOf(
    [
      // Two valid possibilities : dateofbirth is empty, or dateofbirth is valid format.
      check('dateOfBirth').trim().isEmpty(),
      check('dateOfBirth')
        .trim().isDate({ format: date.formatFrenchDateForm })
        .customSanitizer((value, { req }) => req.sanitize(value)),
    ],
    `La date de naissance n'est pas valide, le format doit être JJ/MM/AAAA.
    Si vous ne l'avez pas maintenant, ce n'est pas grave, vous pourrez y revenir plus tard.`,
  ),
  check('institutionName')
    .trim()
    .customSanitizer((value, { req }) => req.sanitize(value)),
  check('doctorAddress')
    .trim()
    .customSanitizer((value, { req }) => req.sanitize(value)),
  check('doctorName')
    .trim()
    .customSanitizer((value, { req }) => req.sanitize(value)),
];

const updateValidators = [
  // todo : do we html-escape here ? We already escape in templates.
  check('patientId')
    .trim().not().isEmpty()
    .isUUID()
    .withMessage('Ce patient n\'existe pas.'),
  ...patientValidators,
];

const update = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { patientId } = req.params;
  const patientFirstNames = req.body.firstNames;
  const patientLastName = req.body.lastName;
  const dateOfBirth = date.parseDateForm(req.body.dateOfBirth);
  const patientINE = req.body.INE;
  const patientInstitutionName = req.body.institutionName;
  const { doctorName } = req.body;
  const { doctorAddress } = req.body;
  // Force to boolean beacause checkbox value send undefined when it's not checked
  const patientIsStudentStatusVerified = Boolean(req.body.isStudentStatusVerified);
  const patientHasPrescription = Boolean(req.body.hasPrescription);

  const psychologistId = req.user.psychologist;
  const updated = await dbPatients.updatePatient(
    patientId,
    patientFirstNames,
    patientLastName,
    patientINE,
    patientInstitutionName,
    patientIsStudentStatusVerified,
    patientHasPrescription,
    psychologistId,
    doctorName,
    doctorAddress,
    dateOfBirth,
  );

  if (updated === 0) {
    console.log(`Patient ${patientId} not updated by probably other psy id ${psychologistId}`);
    throw new CustomError('Ce patient n\'existe pas.', 404);
  }

  let infoMessage = `Le patient ${patientFirstNames} ${patientLastName} a bien été modifié.`;
  if (!patientINE || !patientInstitutionName || !patientHasPrescription || !patientIsStudentStatusVerified
      || !doctorAddress) {
    infoMessage += ' Vous pourrez renseigner les champs manquants plus tard'
        + ' en cliquant le bouton "Modifier" du patient.';
  }
  console.log(`Patient ${patientId} updated by psy id ${psychologistId}`);
  res.json({ message: infoMessage });
};

const getOneValidators = [
  check('patientId')
    .trim().not().isEmpty()
    .isUUID()
    .withMessage('Ce patient n\'existe pas.'),
];

const getOne = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { patientId } = req.params;
  const psychologistId = req.user.psychologist;
  const patient = await dbPatients.getPatientById(patientId, psychologistId);

  if (!patient) {
    throw new CustomError('Ce patient n\'existe pas. Vous ne pouvez pas le modifier.', 404);
  }

  console.debug(`Rendering getEditPatient for ${patientId}`);
  res.json(patient);
};

const create = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { firstNames } = req.body;
  const { lastName } = req.body;
  const dateOfBirth = date.parseDateForm(req.body.dateOfBirth);
  const { INE } = req.body;
  const { institutionName } = req.body;
  const { doctorName } = req.body;
  const { doctorAddress } = req.body;
  // Force to boolean beacause checkbox value send undefined when it's not checked
  const isStudentStatusVerified = Boolean(req.body.isStudentStatusVerified);
  const hasPrescription = Boolean(req.body.hasPrescription);

  const psychologistId = req.user.psychologist;
  await dbPatients.insertPatient(
    firstNames,
    lastName,
    INE,
    institutionName,
    isStudentStatusVerified,
    hasPrescription,
    psychologistId,
    doctorName,
    doctorAddress,
    dateOfBirth,
  );
  let infoMessage = `Le patient ${firstNames} ${lastName} a bien été créé.`;
  if (!INE || !institutionName || !hasPrescription || !isStudentStatusVerified || !doctorAddress || !dateOfBirth) {
    infoMessage += ' Vous pourrez renseigner les champs manquants plus tard'
        + ' en cliquant le bouton "Modifier" du patient.';
  }
  console.log(`Patient created by psy id ${psychologistId}`);
  res.json({
    message: infoMessage,
  });
};

const deleteValidators = [
  check('patientId')
    .isUUID()
    .withMessage('Vous devez spécifier un patient à supprimer.'),
];

const deleteOne = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { patientId } = req.params;
  const psychologistId = req.user.psychologist;
  const deleted = await dbPatients.deletePatient(patientId, psychologistId);

  if (deleted === 0) {
    console.log(`Patient ${patientId} not deleted by probably other psy id ${psychologistId}`);
    throw new CustomError('Vous devez spécifier un patient à supprimer.', 404);
  }

  console.log(`Patient deleted ${patientId} by psy id ${psychologistId}`);
  res.json({
    message: 'Le patient a bien été supprimé.',
  });
};

export default {
  updateValidators,
  getOneValidators,
  createValidators: patientValidators,
  deleteValidators,
  getAll: asyncHelper(getAll),
  update: asyncHelper(update),
  getOne: asyncHelper(getOne),
  create: asyncHelper(create),
  delete: asyncHelper(deleteOne),
};
