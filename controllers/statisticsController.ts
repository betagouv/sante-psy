import { Request, Response } from 'express';
import {
  getAppointmentCount, getAvailablePsychologistCount, getPatientCount,
} from '../db/statistics';
import asyncHelper from '../utils/async-helper';

const getAll = async (req: Request, res: Response): Promise<void> => {
  const appointments = getAppointmentCount();
  const psychologist = getAvailablePsychologistCount();
  const patients = getPatientCount();

  const [
    appointmentsCount,
    psychologistCount,
    patientsCount,
  ] = await Promise.all([appointments, psychologist, patients]);
  res.json([
    {
      label: 'Psychologues disponibles',
      value: psychologistCount[0].count,
    },
    {
      label: 'Séances réalisées',
      value: appointmentsCount[0].count,
    },
    {
      label: 'Étudiants accompagnés',
      value: patientsCount[0].count,
    },
  ]);
};

export default {
  getAll: asyncHelper(getAll),
};
