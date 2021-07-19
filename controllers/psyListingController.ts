import { Request, Response } from 'express';

import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';

const getActivePsychologists = async (req: Request, res: Response, reduced: boolean): Promise<void> => {
  const time = `getting all active psychologists from Postgres (query id #${Math.random().toString()})`;
  console.time(time);
  const psyList = await dbPsychologists.getActivePsychologists();
  console.timeEnd(time);

  res.json(reduced
    ? psyList.map((psy) => ({
      dossierNumber: psy.dossierNumber,
      firstNames: psy.firstNames,
      lastName: psy.lastName,
      teleconsultation: psy.teleconsultation,
      address: psy.address,
      departement: psy.departement,
      region: psy.region,
    }))
    : psyList);
};

export default {
  getReducedActivePsychologists: asyncHelper((req, res) => getActivePsychologists(req, res, true)),
  getFullActivePsychologists: asyncHelper((req, res) => getActivePsychologists(req, res, false)),
};
