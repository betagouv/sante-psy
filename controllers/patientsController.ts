import { Request, Response } from 'express';
import dbPatients from '../db/patients';
import dbAppointments from '../db/appointments';
import dbPsychologists from '../db/psychologists';
import validation from '../utils/validation';
import date from '../utils/date';
import ejs from 'ejs';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import { getPatientWithBadges } from '../services/getBadges';
import { Patient } from '../types/Patient';
import getAppointmentsCount from '../services/getAppointmentsCount';
import {
  updateValidators, getOneValidators, patientValidators, deleteValidators,
} from './validators/patientValidators';
import verifyINE from '../services/inesApi';
import send from '../utils/email';

type MulterRequest = Request & { file: Express.Multer.File };

const sortData = (a: Patient, b: Patient): number => (
  `${a.lastName.toUpperCase()} ${a.firstNames}`.localeCompare(`${b.lastName.toUpperCase()} ${b.firstNames}`)
);

const verifyPatientINE = async (INE: string, rawDateOfBirth: string): Promise<boolean> => {
  const dateOfBirth = date.parseForm(rawDateOfBirth);

  try {
    await verifyINE(INE, dateOfBirth);
    return true;
  } catch (error) {
    console.warn('Erreur lors de la requête API INES :', error);
    return false;
  }
};

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

  const isINESvalid = await verifyPatientINE(patientINE, rawDateOfBirth);

  if (!isINESvalid) {
    await dbPatients.updateIsINESValidOnly(patientId, false);
  }

  const patientIsStudentStatusVerified = Boolean(req.body.isStudentStatusVerified);

  const psychologistId = req.auth.psychologist;
  const updated = await dbPatients.update(
    patientId,
    patientFirstNames,
    patientLastName,
    date.parseForm(rawDateOfBirth),
    patientGender,
    patientINE,
    isINESvalid,
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
  res.json({ message: infoMessage, isINESvalid });
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

  const isINESvalid = await verifyPatientINE(INE, rawDateOfBirth);

  const isStudentStatusVerified = Boolean(req.body.isStudentStatusVerified);

  const psychologistId = req.auth.psychologist;
  const addedPatient = await dbPatients.insert(
    firstNames,
    lastName,
    date.parseForm(rawDateOfBirth),
    gender,
    INE,
    isINESvalid,
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
    isINESvalid,
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

const sendCertificate = async (
  req: MulterRequest,
  res: Response,
): Promise<void> => {
  const { patientId, psychologistId } = req.body;

  if (!req.file || !patientId || !psychologistId) {
    throw new CustomError('Certificat, patientId ou psychologistId manquant.', 400);
  }

  try {
    const html = await ejs.renderFile('./views/emails/sendCertificate.ejs', {
      patientId,
      psychologistId,
    });

    await send(
      'support-santepsyetudiant@beta.gouv.fr',
      'Nouveau certificat de scolarité reçu',
      html,
      [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
        },
      ],
    );

    await dbPsychologists.incrementCertificateCount(psychologistId);
    await dbPatients.updateCertificateChecked(patientId);

    res.json({ message: 'Certificat envoyé avec succès.' });
  } catch (err) {
    console.error(err);
    throw new CustomError("Erreur lors de l'envoi du certificat.", 500);
  }
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
  sendCertificate,
};
