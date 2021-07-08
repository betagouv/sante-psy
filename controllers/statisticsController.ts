import { Request, Response } from 'express';
import { getUniversityCount, getActivePsychologistCount, getPatientCount } from '../db/statistics';
import asyncHelper from '../utils/async-helper';

const getAll = async (req: Request, res: Response): Promise<void> => {
  const university = getUniversityCount();
  const psychologist = getActivePsychologistCount();
  const patients = getPatientCount();

  const [universityCount, psychologistCount, patientsCount] = await Promise.all([university, psychologist, patients]);
  res.json(
    {
      success: true,
      statistics: [
        {
          label: 'Universités partenaires',
          value: universityCount[0].count,
        },
        {
          label: 'Psychologues partenaires',
          value: psychologistCount[0].count,
        },
        {
          label: 'Patients accompagnés',
          value: patientsCount[0].count,
        },
      ],
    },
  );
};

export default {
  getAll: asyncHelper(getAll),
};