import { Request, Response } from 'express';

import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';

const getAllActive = async (req: Request, res: Response, reduced: boolean): Promise<void> => {
  const time = `getting all active psychologists from Postgres (query id #${Math.random().toString()})`;
  console.time(time);
  const psyList = await dbPsychologists.getAllActive();
  console.timeEnd(time);

  res.json(reduced
    ? psyList.map((psy) => ({
      dossierNumber: psy.dossierNumber,
      firstNames: psy.useFirstNames || psy.firstNames,
      lastName: psy.useLastName || psy.lastName,
      teleconsultation: psy.teleconsultation,
      departement: psy.departement,
      region: psy.region,
      address: psy.address,
      longitude: psy.longitude,
      latitude: psy.latitude,
      otherAddress: psy.otherAddress,
      otherLongitude: psy.otherLongitude,
      otherLatitude: psy.otherLatitude,
    }))
    : psyList);
};

export default {
  getReducedActive: asyncHelper((req, res) => getAllActive(req, res, true)),
  getFullActive: asyncHelper((req, res) => getAllActive(req, res, false)),
};
