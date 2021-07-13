import { Request, Response } from 'express';
import {
  getUniversityCount, getAppointmentCount, getActivePsychologistCount, getPatientCount,
} from '../db/statistics';
import asyncHelper from '../utils/async-helper';

const getAll = async (req: Request, res: Response): Promise<void> => {
  const university = getUniversityCount();
  const appointments = getAppointmentCount();
  const psychologist = getActivePsychologistCount();
  const patients = getPatientCount();

  const [
    universityCount,
    appointmentsCount,
    psychologistCount,
    patientsCount,
  ] = await Promise.all([university, appointments, psychologist, patients]);
  res.json([
    {
      label: 'Universités partenaires',
      value: universityCount[0].count,
    },
    {
      label: 'Nombre de séances réalisées',
      value: appointmentsCount[0].count,
    },
    {
      label: 'Psychologues partenaires',
      value: psychologistCount[0].count,
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
