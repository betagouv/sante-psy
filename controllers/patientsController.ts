import { Request, Response } from 'express';
import { check, oneOf } from 'express-validator';
import DOMPurify from '../services/sanitizer';

import dbPatients from '../db/patients';
import dbAppointments from '../db/appointments';
import validation from '../utils/validation';
import date from '../utils/date';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import { getPatientWithBadges } from '../services/getBadges';

const getAll = async (req: Request, res: Response): Promise<void> => {
  const psychologistId = req.auth.psychologist;
  const patients = await dbPatients.getAll(psychologistId);
  const patientsWithBadges = getPatientWithBadges(patients);
  res.json(patientsWithBadges);
};

// Validators we reuse for editPatient and createPatient
const patientValidators = [
  // todo : do we html-escape here ? We already escape in templates.
  check('firstNames')
    .trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier le.s prénom.s du patient.'),
  check('lastName')
    .trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier le nom du patient.'),
  oneOf(
    [
      // Two valid possibilities : ine is empty, or ine is valid format.
      check('INE').trim().isEmpty(),
      check('INE')
        .trim().isAlphanumeric()
        .isLength({ min: 1, max: 50 })
        .customSanitizer(DOMPurify.sanitize),
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
        .customSanitizer(DOMPurify.sanitize),
    ],
    `La date de naissance n'est pas valide, le format doit être JJ/MM/AAAA.
    Si vous ne l'avez pas maintenant, ce n'est pas grave, vous pourrez y revenir plus tard.`,
  ),
  check('institutionName')
    .trim()
    .customSanitizer(DOMPurify.sanitize),

  // all following prescriptions infos are optionnal so two
  // valid option: field is empty or check if has the right format
  oneOf(
    [
      check('doctorAddress').trim().isEmpty(),
      check('doctorAddress')
      .trim()
      .customSanitizer(DOMPurify.sanitize),
    ],
  ),
  oneOf(
    [
      check('doctorName').trim().isEmpty(),
      check('doctorName')
      .trim()
      .customSanitizer(DOMPurify.sanitize),
    ],
  ),
  oneOf(
    [
      check('doctorEmail').trim().isEmpty(),
      check('doctorEmail')
      .trim()
      .isEmail()
      .withMessage('Vous devez spécifier un email valide.')
      .customSanitizer(DOMPurify.sanitize),
    ],
  ),
  oneOf(
    [
      check('dateOfPrescription').trim().isEmpty(),
      check('dateOfPrescription')
          .trim().isDate({ format: date.formatFrenchDateForm })
          .customSanitizer(DOMPurify.sanitize),
    ],
    `La date de prescription n'est pas valide, le format doit être JJ/MM/AAAA.
    Si vous ne l'avez pas maintenant, ce n'est pas grave, vous pourrez y revenir plus tard.`,
  ),
];

const updateValidators = [
  // todo : do we html-escape here ? We already escape in templates.
  check('patientId')
    .trim().not().isEmpty()
    .withMessage('Ce patient n\'existe pas.')
    .isUUID()
    .withMessage('Ce patient n\'existe pas.'),
  ...patientValidators,
];

const update = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { patientId } = req.params;
  const patientFirstNames = req.body.firstNames;
  const patientLastName = req.body.lastName;
  const dateOfBirth = date.parseForm(req.body.dateOfBirth);
  const patientINE = req.body.INE;
  const patientInstitutionName = req.body.institutionName;
  const {
    doctorName, doctorAddress, doctorEmail,
  } = req.body;
  const dateOfPrescription = date.parseForm(req.body.dateOfPrescription);
  // Force to boolean beacause checkbox value send undefined when it's not checked
  const patientIsStudentStatusVerified = Boolean(req.body.isStudentStatusVerified);
  const patientHasPrescription = Boolean(req.body.hasPrescription);

  const psychologistId = req.auth.psychologist;
  const updated = await dbPatients.update(
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
    doctorEmail,
    dateOfBirth,
    dateOfPrescription,
  );

  if (updated === 0) {
    console.log(`Patient ${patientId} not updated by probably other psy id ${psychologistId}`);
    throw new CustomError('Ce patient n\'existe pas.', 404);
  }

  let infoMessage = `L'étudiant ${patientFirstNames} ${patientLastName} a bien été modifié.`;
  if (!patientINE || !patientInstitutionName || !patientHasPrescription || !patientIsStudentStatusVerified
      || !doctorAddress || !doctorEmail || !dateOfBirth || !dateOfPrescription) {
    infoMessage += ' Vous pourrez renseigner les champs manquants plus tard'
        + ' en cliquant le bouton "Modifier" du patient.';
  }
  console.log(`Patient ${patientId} updated by psy id ${psychologistId}`);
  res.json({ message: infoMessage });
};

const getOneValidators = [
  check('patientId')
    .trim().not().isEmpty()
    .withMessage('Ce patient n\'existe pas.')
    .isUUID()
    .withMessage('Ce patient n\'existe pas.'),
];

const getOne = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { patientId } = req.params;
  const psychologistId = req.auth.psychologist;
  const patient = await dbPatients.getById(patientId, psychologistId);
  const patientWithBadges = getPatientWithBadges([patient]);

  if (!patient) {
    throw new CustomError('Ce patient n\'existe pas. Vous ne pouvez pas le modifier.', 404);
  }

  console.debug(`Rendering getEditPatient for ${patientId}`);
  res.json(patientWithBadges);
};

const create = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { firstNames } = req.body;
  const { lastName } = req.body;
  const dateOfBirth = date.parseForm(req.body.dateOfBirth);
  const { INE } = req.body;
  const { institutionName } = req.body;
  const {
    doctorName, doctorAddress, doctorEmail,
  } = req.body;
  const dateOfPrescription = date.parseForm(req.body.dateOfPrescription);
  // Force to boolean beacause checkbox value send undefined when it's not checked
  const isStudentStatusVerified = Boolean(req.body.isStudentStatusVerified);
  const hasPrescription = Boolean(req.body.hasPrescription);

  const psychologistId = req.auth.psychologist;
  await dbPatients.insert(
    firstNames,
    lastName,
    INE,
    institutionName,
    isStudentStatusVerified,
    hasPrescription,
    psychologistId,
    doctorName,
    doctorAddress,
    doctorEmail,
    dateOfBirth,
    dateOfPrescription,
  );
  let infoMessage = `L'étudiant ${firstNames} ${lastName} a bien été créé.`;
  if (!INE || !institutionName || !hasPrescription || !isStudentStatusVerified || !doctorAddress
    || !doctorEmail || !dateOfPrescription) {
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
    .withMessage('Vous devez spécifier un étudiant à supprimer.'),
];

const deleteOne = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { patientId } = req.params;
  const psychologistId = req.auth.psychologist;

  const patientAppointment = await dbAppointments.countByPatient(patientId);

  if (patientAppointment[0].count > 0) {
    throw new CustomError('Vous ne pouvez pas supprimer un étudiant avec des séances.', 400);
  }

  const deleted = await dbPatients.delete(patientId, psychologistId);

  if (deleted === 0) {
    console.log(`Patient ${patientId} not deleted by probably other psy id ${psychologistId}`);
    throw new CustomError('Vous devez spécifier un étudiant à supprimer.', 404);
  }

  console.log(`Patient deleted ${patientId} by psy id ${psychologistId}`);
  res.json({
    message: "L'étudiant a bien été supprimé.",
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
