import { Request, Response } from 'express';
import dbPatients from '../db/patients';
import dbAppointments from '../db/appointments';
import dbStudents from '../db/students';
import validation from '../utils/validation';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import { getPatientWithBadges } from '../services/getBadges';
import { PatientWithStudent } from '../types/Patient';
import getAppointmentsCount from '../services/getAppointmentsCount';
import {
  getOneValidators,
  patientValidators,
  deleteValidators,
} from './validators/patientValidators';
import { Student } from '../types/Student';

const getSortName = (item: PatientWithStudent | Student): string =>
  `${item.lastName.toUpperCase()} ${item.firstNames}`;

const sortData = (a: PatientWithStudent, b: PatientWithStudent): number => {
  const aName = getSortName(a.student || a);
  const bName = getSortName(b.student || b);
  return aName.localeCompare(bName);
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  const psychologistId = req.auth.userId || req.auth.psychologist;

  const patients = await dbPatients.getAll(psychologistId);
  const patientsWithCount = await getAppointmentsCount(patients);
  const patientsWithBadges = getPatientWithBadges(patientsWithCount);

  const sortedData = patientsWithBadges.sort(sortData);
  res.json(sortedData);
};

const getOne = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { patientId } = req.params;
  const psychologistId = req.auth.userId || req.auth.psychologist;

  const patient = await dbPatients.getById(patientId, psychologistId);

  if (!patient) {
    throw new CustomError(
      "Ce patient n'existe pas. Vous ne pouvez pas le modifier.",
      404,
    );
  }

  const patientWithBadges = getPatientWithBadges([patient])[0];

  console.debug(`Rendering getEditPatient for ${patientId}`);
  res.json(patientWithBadges);
};

const create = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { ine, birthDate: rawDateOfBirth } = req.body;
  const [day, month, year] = rawDateOfBirth.split('/');
  const birthDate = `${year}-${month}-${day}`;

  const psychologistId = req.auth.userId || req.auth.psychologist;

  const student = await dbStudents.getByEmailAndBirthDate(ine, birthDate);

  if (!student) {
    res.status(404);
    res.json({
      message: "L'étudiant n'existe pas.",
    });
    return;
  }

  // l'etudiant est deja un patient du psy
  const newPatient = await dbPatients.insert(psychologistId, student.id);

  res.json({
    patientCreated: !!newPatient,
  });
};

const deleteOne = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { patientId } = req.params;
  const psychologistId = req.auth.userId || req.auth.psychologist;

  const patientAppointment = await dbAppointments.countByPatient(patientId);

  if (patientAppointment[0].count > 0) {
    throw new CustomError(
      'Vous ne pouvez pas supprimer un étudiant avec des séances.',
      400,
    );
  }

  const deleted = await dbPatients.delete(patientId, psychologistId);

  if (deleted === 0) {
    console.log(
      `Patient ${patientId} not deleted by probably other psy id ${psychologistId}`,
    );
    throw new CustomError('Vous devez spécifier un étudiant à supprimer.', 404);
  }

  console.log(`Patient deleted ${patientId} by psy id ${psychologistId}`);
  res.json({
    message: "L'étudiant a bien été supprimé.",
  });
};

export default {
  getOneValidators,
  createValidators: patientValidators,
  deleteValidators,
  getAll: asyncHelper(getAll),
  getOne: asyncHelper(getOne),
  create: asyncHelper(create),
  delete: asyncHelper(deleteOne),
};
