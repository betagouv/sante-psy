import { Request, Response } from 'express';
import dbPatients from '../db/patients';
import dbAppointments from '../db/appointments';
import validation from '../utils/validation';
import date from '../utils/date';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import { getPatientWithBadges } from '../services/getBadges';
import { Patient } from '../types/Patient';
import getAppointmentsCount from '../services/getAppointmentsCount';
import {
  updateValidators, getOneValidators, patientValidators, deleteValidators,
} from './validators/patientValidators';
import verifyINE from '../services/InesApi';

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

const update = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { patientId } = req.params;
  const {
    firstNames: patientFirstNames,
    lastName: patientLastName,
    gender: patientGender,
    dateOfBirth: rawDateOfBirth,
    INE: patientINE,
    institutionName: patientInstitutionName,
    doctorName,
  } = req.body;
  const dateOfBirth = date.parseForm(rawDateOfBirth);

  await verifyINE(patientINE, dateOfBirth);

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
  if (!patientInstitutionName || !patientIsStudentStatusVerified || !doctorName) {
    infoMessage += ' Vous pourrez renseigner les champs manquants plus tard'
        + ' en cliquant le bouton "Modifier" du patient.';
  }
  console.log(`Patient ${patientId} updated by psy id ${psychologistId}`);
  res.json({ message: infoMessage });
};

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

  const {
    firstNames, lastName, gender, INE, institutionName, doctorName, dateOfBirth: rawDateOfBirth,
  } = req.body;
  const dateOfBirth = date.parseForm(rawDateOfBirth);

  await verifyINE(INE, dateOfBirth);

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
  if (!institutionName || !doctorName || !isStudentStatusVerified) {
    infoMessage += ' Vous pourrez renseigner les champs manquants plus tard'
        + ' en cliquant le bouton "Modifier" du patient.';
  }
  console.log(`Patient created by psy id ${psychologistId}`);
  res.json({
    message: infoMessage,
    patientId: addedPatient.id,
  });
};

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
