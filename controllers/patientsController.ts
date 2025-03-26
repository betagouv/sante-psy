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
import { Patient } from '../types/Patient';
import getAppointmentsCount from '../services/getAppointmentsCount';

const sortData = (a: Patient, b: Patient) : number => (
  `${a.lastName.toUpperCase()} ${a.firstNames}`).localeCompare(`${b.lastName.toUpperCase()} ${b.firstNames}`);

const getAll = async (req: Request, res: Response): Promise<void> => {
  const psychologistId = req.auth.psychologist;
  const patients = await dbPatients.getAll(psychologistId);
  const patientsWithCount = await getAppointmentsCount(patients);
  const patientsWithBadges = getPatientWithBadges(patientsWithCount);

  const sortedData = patientsWithBadges.sort(sortData);
  res.json(sortedData);
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
  check('gender')
    .trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .isIn(['male', 'female', 'other'])
    .withMessage('Vous devez spécifier le genre du patient.'),
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

  oneOf(
    [
      check('doctorName').trim().isEmpty(),
      check('doctorName')
      .trim()
      .customSanitizer(DOMPurify.sanitize),
    ],
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
  const patientGender = req.body.gender;
  const dateOfBirth = date.parseForm(req.body.dateOfBirth);
  const patientINE = req.body.INE;
  const patientInstitutionName = req.body.institutionName;
  const {
    doctorName,
  } = req.body;
  // Force to boolean beacause checkbox value send undefined when it's not checked
  const patientIsStudentStatusVerified = Boolean(req.body.isStudentStatusVerified);

  const psychologistId = req.auth.psychologist;
  const updated = await dbPatients.update(
    patientId,
    patientFirstNames,
    patientLastName,
    dateOfBirth,
    patientGender,
    patientINE,
    patientInstitutionName,
    patientIsStudentStatusVerified,
    psychologistId,
    doctorName,
  );

  if (updated === 0) {
    console.log(`Patient ${patientId} not updated by probably other psy id ${psychologistId}`);
    throw new CustomError('Ce patient n\'existe pas.', 404);
  }

  let infoMessage = `L'étudiant ${patientFirstNames} ${patientLastName} a bien été modifié.`;
  if (!patientINE || !patientInstitutionName || !patientIsStudentStatusVerified || !doctorName) {
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

  if (!patient) {
    throw new CustomError('Ce patient n\'existe pas. Vous ne pouvez pas le modifier.', 404);
  }

  const patientWithBadges = getPatientWithBadges([patient])[0];

  console.debug(`Rendering getEditPatient for ${patientId}`);
  res.json(patientWithBadges);
};

const create = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { firstNames } = req.body;
  const { lastName } = req.body;
  const { gender } = req.body;
  const dateOfBirth = date.parseForm(req.body.dateOfBirth);
  const { INE } = req.body;
  const { institutionName } = req.body;
  const {
    doctorName,
  } = req.body;
  // Force to boolean beacause checkbox value send undefined when it's not checked
  const isStudentStatusVerified = Boolean(req.body.isStudentStatusVerified);

  const psychologistId = req.auth.psychologist;
  const addedPatient = await dbPatients.insert(
    firstNames,
    lastName,
    dateOfBirth,
    gender,
    INE,
    institutionName,
    isStudentStatusVerified,
    psychologistId,
    doctorName,
  );
  let infoMessage = `L'étudiant ${firstNames} ${lastName} a bien été créé.`;
  if (!INE || !institutionName || !doctorName || !isStudentStatusVerified) {
    infoMessage += ' Vous pourrez renseigner les champs manquants plus tard'
        + ' en cliquant le bouton "Modifier" du patient.';
  }
  console.log(`Patient created by psy id ${psychologistId}`);
  res.json({
    message: infoMessage,
    patientId: addedPatient.id,
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
