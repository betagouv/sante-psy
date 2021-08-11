import { Request, Response } from 'express';

import { check } from 'express-validator';
import dbAppointments from '../db/appointments';
import dbPatient from '../db/patients';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
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

  const beginningDate = new Date('2021-03-21');
  const date = new Date(req.body.date);
  const today = new Date();
  const diffInMonth = Math.abs(date.getMonth() - today.getMonth());
  const { patientId } = req.body;
  const psyId = req.user.psychologist;
  const patientExist = await dbPatient.getById(patientId, psyId);

  if (patientExist) {
    if (date < beginningDate) {
      console.warn(
        "It's impossible to declare an appointment before 21/03/2021",
      );
      throw new CustomError('La date de la séance doit être apres le 21 mars 2021', 400);
    }
    if (date > today && diffInMonth > 4) {
      console.warn(
        'The difference between today and the declaration date is beyond 4 month',
      );
      throw new CustomError('La date de la séance doit être dans moins de 4 mois', 400);
    }
    await dbAppointments.insert(date, patientId, psyId);
    console.log(
      `Appointment created for patient id ${patientId} by psy id ${psyId}`,
    );
    res.json({
      message: `La séance du ${dateUtils.formatFrenchDate(date)} a bien été créée.`,
    });
  } else {
    console.warn(
      `Patient id ${patientId} does not exist for psy id : ${psyId}`,
    );
    throw new CustomError("Erreur. La séance n'est pas créée. Pourriez-vous réessayer ?");
  }
};

const deleteValidators = [
  check('appointmentId')
    .isUUID()
    .withMessage('Vous devez spécifier une séance à supprimer.'),
];

const deleteOne = async (req: Request, res: Response) : Promise<void> => {
  validation.checkErrors(req);

  const { appointmentId } = req.params;
  const psychologistId = req.user.psychologist;
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
  const psychologistId = req.user.psychologist;
  const appointments = await dbAppointments.getAll(psychologistId);

  res.json(appointments);
};

export default {
  createValidators,
  deleteValidators,
  create: asyncHelper(create),
  getAll: asyncHelper(getAll),
  delete: asyncHelper(deleteOne),
};
