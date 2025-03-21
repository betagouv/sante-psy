import { Request, Response } from 'express';
import {
  getAppointmentCount, getAvailablePsychologistCount, getPatientCount,
  getTeleconsultPsyCount,
} from '../db/statistics';
import asyncHelper from '../utils/async-helper';

const getAll = async (req: Request, res: Response): Promise<void> => {
  const appointments = getAppointmentCount();
  const psychologist = getAvailablePsychologistCount();
  const patients = getPatientCount();
  const teleconsultPsy = getTeleconsultPsyCount();

  const [
    appointmentsCount,
    psychologistCount,
    patientsCount,
    teleconsultPsyCount,
  ] = await Promise.all([appointments, psychologist, patients, teleconsultPsy]);
  res.json({
    psychologistCount: {
      label: 'Psychologues disponibles',
      value: psychologistCount[0].count,
    },
    appointmentsCount: {
      label: 'Séances réalisées',
      value: appointmentsCount[0].count,
    },
    patientsCount: {
      label: 'Étudiants accompagnés',
      value: patientsCount[0].count,
    },
    teleconsultPsyCount: {
      label: 'Psychologues disponibles en téléconsultation',
      value: teleconsultPsyCount[0].count,
    },
  });
};

export default {
  getAll: asyncHelper(getAll),
};
