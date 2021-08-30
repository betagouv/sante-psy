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
      label: 'Séances réalisées',
      value: appointmentsCount[0].count,
      slug: 'appointments',
    },
    {
      label: 'Étudiants accompagnés',
      value: patientsCount[0].count,
      slug: 'students',
    },
    {
      label: 'Psychologues partenaires',
      value: psychologistCount[0].count,
      slug: 'psychologists',
    },
    {
      label: 'Universités partenaires',
      value: universityCount[0].count,
      slug: 'universities',
    },
  ]);
};

export default {
  getAll: asyncHelper(getAll),
};
