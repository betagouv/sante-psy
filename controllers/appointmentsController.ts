import { Request, Response } from 'express';

import { check } from 'express-validator';
import dbAppointments from '../db/appointments';
import dbPatient from '../db/patients';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import { getAppointmentWithBadges } from '../services/getBadges';
import dateUtils from '../utils/date';
import validation from '../utils/validation';
import { AppointmentByYear } from '../types/Appointment';
import _ from 'lodash';

const createValidators = [
  check('date')
    .isISO8601()
    .withMessage('Vous devez spécifier une date pour la séance.'),
  check('patientId')
    .isUUID()
    .withMessage('Vous devez spécifier un patient pour la séance.'),
];

const create = async (req: Request, res: Response): Promise<void> => {
  // Todo : test case where patient id does not exist
  validation.checkErrors(req);

  const { patientId } = req.body;
  const psyId = req.auth.userId || req.auth.psychologist;

  if (!psyId) {
    res.status(403).json({ message: 'Non autorisé' });
    return;
  }

  const date = new Date(req.body.date);
  const today = new Date();
  const limitDate = new Date(today.setMonth(today.getMonth() + 4));

  const patientExist = await dbPatient.getById(patientId, psyId);
  if (!patientExist) {
    console.warn(`Patient id ${patientId} does not exist for psy id : ${psyId}`);
    throw new CustomError("Erreur. La séance n'est pas créée. Pourriez-vous réessayer ?");
  }

  const psy = await dbPsychologists.getById(psyId);
  if (date < psy.createdAt) {
    console.warn("It's impossible to declare an appointment before psychologist creation date");
    throw new CustomError("La date de la séance ne peut pas être antérieure à l'inscription au dispositif", 400);
  }

  if (date > limitDate) {
    console.warn('The difference between today and the declaration date is beyond 4 month');
    throw new CustomError('La date de la séance doit être dans moins de 4 mois', 400);
  }

  await dbAppointments.insert(date, patientId, psyId);
  console.log(`Appointment created for patient id ${patientId} by psy id ${psyId}`);

  res.json({ message: `La séance du ${dateUtils.formatFrenchDate(date)} a bien été créée.` });
};

const deleteValidators = [
  check('appointmentId')
    .isUUID()
    .withMessage('Vous devez spécifier une séance à supprimer.'),
];

const deleteOne = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { appointmentId } = req.params;
  const psychologistId = req.auth.userId || req.auth.psychologist;

  if (!psychologistId) {
    res.status(403).json({ message: 'Non autorisé' });
    return;
  }

  const deletedAppointment = await dbAppointments.delete(appointmentId, psychologistId);
  if (deletedAppointment === 0) {
    console.log(
      `Appointment ${appointmentId} does not belong to psy id ${psychologistId}`,
    );
    throw new CustomError('Impossible de supprimer cette séance.', 404);
  }
  console.log(
    `Appointment deleted ${appointmentId} by psy id ${psychologistId}`,
  );

  res.json({
    message: 'La séance a bien été supprimée.',
  });
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  const { isBillingPurposes, year, month } = req.query;
  const psychologistId = req.auth.userId || req.auth.psychologist;

  if (!psychologistId) {
    res.status(403).json({ message: 'Non autorisé' });
    return;
  }

  let dateRange = null;
  let selectedPeriod = null;

  if (year && month) {
    const SEPTEMBER = 9;
    const DECEMBER = 12;

    const selectedYear = parseInt(year.toString());
    const selectedMonth = parseInt(month.toString());
    const startYear = (selectedMonth >= SEPTEMBER && selectedMonth <= DECEMBER) ? selectedYear : selectedYear - 1;
    const startDate = dateUtils.getUTCDate(new Date(startYear, 8));
    const endYear = (selectedMonth >= SEPTEMBER && selectedMonth <= DECEMBER) ? selectedYear + 1 : selectedYear;
    const endDate = dateUtils.getUTCDate(new Date(endYear, 8));

    dateRange = { startDate, endDate };
    selectedPeriod = { year: selectedYear, month: selectedMonth };
  }

  const psychologistaAppointments = await dbAppointments.getAll(
    psychologistId,
    dateRange,
    [{ column: 'patientId' }, { column: 'appointmentDate' }],
  );
  const appointments = await dbAppointments.getRelatedINEAppointments(psychologistaAppointments, dateRange);

  const appointmentsWithBadges = getAppointmentWithBadges(
    appointments,
    isBillingPurposes === 'true',
    selectedPeriod,
    null,
  );

  const filteredPsychologistAppointments = appointmentsWithBadges.filter((appointment) => {
    const isPsychologistAppointment = appointment.psychologistId === psychologistId;

    if (year && month) {
      const appointmentDate = new Date(appointment.appointmentDate);
      const appointmentYear = appointmentDate.getFullYear().toString();
      const appointmentMonth = (appointmentDate.getMonth() + 1).toString();
      return isPsychologistAppointment && appointmentYear === year && appointmentMonth === month;
    }

    return isPsychologistAppointment;
  });

  res.json(filteredPsychologistAppointments);
};

const getByPatientId = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const psychologistId = req.auth.userId || req.auth.psychologist;

  if (!psychologistId) {
    res.status(403).json({ message: 'Non autorisé' });
    return;
  }

  const { patientId } = req.params;

  const patient = await dbPatient.getById(patientId, psychologistId);
  if (!patient) {
    throw new CustomError('Ce patient n\'existe pas', 404);
  }

  const appointments = await dbAppointments.getByPatientId(
    patientId,
    patient.INE.trim() !== '',
    [{ column: 'appointmentDate' }],
  );
  const appointmentsWithBadges = getAppointmentWithBadges(
    appointments,
    false,
    null,
    psychologistId,
  );

  const appointmentsByYear: AppointmentByYear = _.groupBy(appointmentsWithBadges, 'univYear') as AppointmentByYear;
  res.json(appointmentsByYear);
};

export default {
  createValidators,
  deleteValidators,
  create: asyncHelper(create),
  getAll: asyncHelper(getAll),
  getByPatientId: asyncHelper(getByPatientId),
  delete: asyncHelper(deleteOne),
};
