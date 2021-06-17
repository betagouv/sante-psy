import { Request, Response } from 'express';

import { check } from 'express-validator';
import dbAppointments from '../db/appointments';
import dbPatient from '../db/patients';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';
import dateUtils from '../utils/date';
import validation from '../utils/validation';

const createNewAppointmentValidators = [
  check('date')
    .isISO8601()
    .withMessage('Vous devez spécifier une date pour la séance.'),
  check('patientId')
    .isUUID()
    .withMessage('Vous devez spécifier un patient pour la séance.'),
];

const createNewAppointment = async (req: Request, res: Response): Promise<void> => {
  // Todo : test case where patient id does not exist
  validation.checkErrors(req);

  const date = new Date(req.body.date);
  const { patientId } = req.body;
  const psyId = req.user.psychologist;
  const patientExist = await dbPatient.getPatientById(patientId, psyId);

  if (patientExist) {
    await dbAppointments.insertAppointment(date, patientId, psyId);
    console.log(
      `Appointment created for patient id ${patientId} by psy id ${psyId}`,
    );
    res.json({
      success: true,
      message: `La séance du ${dateUtils.formatFrenchDate(date)} a bien été créée.`,
    });
  } else {
    console.warn(
      `Patient id ${patientId} does not exist for psy id : ${psyId}`,
    );
    throw new CustomError("Erreur. La séance n'est pas créée. Pourriez-vous réessayer ?");
  }
};

const deleteAppointmentValidators = [
  check('appointmentId')
    .isUUID()
    .withMessage('Vous devez spécifier une séance à supprimer.'),
];

const deleteAppointment = async (req: Request, res: Response) : Promise<void> => {
  validation.checkErrors(req);

  const { appointmentId } = req.params;
  const psychologistId = req.user.psychologist;
  const deletedAppointment = await dbAppointments.deleteAppointment(appointmentId, psychologistId);
  if (deletedAppointment === 0) {
    console.log(
      `Appointment ${appointmentId} does not belong to psy id ${psychologistId}`,
    );
    throw new CustomError('Impossible de supprimer cette séance.', 400);
  }
  console.log(
    `Appointment deleted ${appointmentId} by psy id ${psychologistId}`,
  );

  res.json({
    success: true,
    message: 'La séance a bien été supprimée.',
  });
};

const getAppointments = async (req: Request, res: Response): Promise<void> => {
  const psychologistId = req.user.psychologist;
  const appointments = await dbAppointments.getAppointments(psychologistId);

  res.json({ success: true, appointments });
};

export default {
  createNewAppointmentValidators,
  deleteAppointmentValidators,
  createNewAppointment: asyncHelper(createNewAppointment),
  getAppointments: asyncHelper(getAppointments),
  deleteAppointment: asyncHelper(deleteAppointment),
};
