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
  const psyId = req.auth.psychologist;
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
  const psychologistId = req.auth.psychologist;
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
  const psychologistId = req.auth.psychologist;
  let dateRange = null;
  let selectedPeriod = null;
  if (year && month) {
    // get date range from september to selected month
    const SEPTEMBER = 9;
    const DECEMBER = 12;

    const selectedYear = parseInt(year.toString());
    const selectedMonth = parseInt(month.toString());
    const startYear = (selectedMonth >= SEPTEMBER && selectedMonth <= DECEMBER) ? selectedYear : selectedYear - 1;
    const startDate = dateUtils.getUTCDate(new Date(startYear, 8));
    const endDate = dateUtils.getUTCDate(new Date(selectedYear, selectedMonth));

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

  const psychologistAppointments = appointmentsWithBadges
  .filter((appointment) => appointment.psychologistId === psychologistId);

  res.json(psychologistAppointments);
};

const getByPatientId = async (req: Request, res: Response): Promise<void> => {
  const psychologistId = req.auth.psychologist;
  const { patientId } = req.params;

  const appointments = await dbAppointments.getByPatientId(
    patientId,
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
