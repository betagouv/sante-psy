import { Request, Response } from 'express';

import { check } from 'express-validator';
import dbAppointments from '../db/appointments';
import date from '../utils/date';
import dbPsychologists from '../db/psychologists';
import validation from '../utils/validation';
import asyncHelper from '../utils/async-helper';

function mergeTotalPatientAppointments(totalAppointments, totalPatients) {
  return totalPatients.map((totalPatient) => {
    const appointForMonthYear = totalAppointments.find(
      (appointment) => appointment.year === totalPatient.year && appointment.month === totalPatient.month,
    );

    return {
      year: totalPatient.year,
      month: date.getFrenchMonthName(totalPatient.month),
      countPatients: totalPatient.countPatients,
      countAppointments: appointForMonthYear ? appointForMonthYear.countAppointments : 0,
    };
  });
}

async function getTotalAppointmentsAndPatientByPsy(req: Request) {
  const psychologistId = req.user.psychologist;
  const totalAppointments = await dbAppointments.getCountAppointmentsByYearMonth(psychologistId);
  const totalPatients = await dbAppointments.getCountPatientsByYearMonth(psychologistId);
  return mergeTotalPatientAppointments(totalAppointments, totalPatients);
}

const reimbursement = async (req: Request, res: Response): Promise<void> => {
  const totalAppointmentsAndPatientByPsy = await getTotalAppointmentsAndPatientByPsy(req);

  res.json({
    success: true,
    total: totalAppointmentsAndPatientByPsy,
  });
};

const updateConventionInfoValidators = [
  // Note : no sanitizing because isUUID will not allow strange html anyway.
  check('universityId')
    .isUUID()
    .withMessage('Vous devez choisir une université.'),
  // Note : no sanitizing because only 2 possible values, so will not allow strange html anyway.
  check('isConventionSigned')
    .isBoolean()
    .withMessage('Vous devez spécifier si la convention est signée ou non.'),
];

const updateConventionInfo = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { universityId, isConventionSigned } = req.body;

  const psychologistId = req.user.psychologist;
  await dbPsychologists.updateConventionInfo(psychologistId, universityId, isConventionSigned);
  const convention = await dbPsychologists.getConventionInfo(psychologistId);
  res.json({
    success: true,
    message: 'Vos informations de conventionnement sont bien enregistrées.',
    convention,
  });
};

export default {
  updateConventionInfoValidators,
  reimbursement: asyncHelper(reimbursement),
  updateConventionInfo: asyncHelper(updateConventionInfo),
};
