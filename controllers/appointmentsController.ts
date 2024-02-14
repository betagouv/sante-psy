import { Request, Response } from 'express';

import { check } from 'express-validator';
import dbAppointments from '../db/appointments';
import dbPatient from '../db/patients';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import extractFirstAppointments from '../services/appointments';
import getAppointmentBadges from '../services/getBadges';
import dateUtils from '../utils/date';
import validation from '../utils/validation';

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
  const includeBadges = req.query.includeBadges === 'true';
  const psychologistId = req.auth.psychologist;
  if (includeBadges) {
    const appointments = await dbAppointments.getAll(
      psychologistId,
      [{ column: 'patientId' }, { column: 'appointmentDate' }],
    );
    const appointmentsWithBadges = getAppointmentBadges(appointments);
    console.log('DEBUG - appointmentsWithBadges lenght : ', appointmentsWithBadges.length);
    res.json(appointmentsWithBadges);
  } else {
    const appointments = await dbAppointments.getAll(psychologistId, [{ column: 'appointmentDate', order: 'desc' }]);
    console.log('DEBUG - appointmentsWithBadges lenght : ', appointments.length);
    res.json(appointments);
  }
};

const getFirstAppointments = async (req: Request, res: Response): Promise<void> => {
  const psychologistId = req.auth.psychologist;
  const appointments = await dbAppointments.getAll(
    psychologistId,
    [{ column: 'patientId' }, { column: 'appointmentDate' }],
  );
  const firstAppointments = extractFirstAppointments(appointments);

  res.json(firstAppointments);
};

export default {
  extractFirstAppointments,
  createValidators,
  deleteValidators,
  create: asyncHelper(create),
  getAll: asyncHelper(getAll),
  getFirstAppointments: asyncHelper(getFirstAppointments),
  delete: asyncHelper(deleteOne),
};
