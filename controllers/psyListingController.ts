import { Request, Response } from 'express';

import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';
import getAddrCoordinates from '../services/getAddrCoordinates';
import { Coordinates } from '../types/Coordinates';

const getAllActive = async (req: Request, res: Response, reduced: boolean): Promise<void> => {
  const time = `getting all active psychologists from Postgres (query id #${Math.random().toString()})`;
  console.time(time);

  let coordinates : Coordinates = {};
  if (req.params && req.params.address && req.params.address !== 'undefined') {
    coordinates = await getAddrCoordinates(req.params.address);
  }

  const psyList = await dbPsychologists.getAllActive(coordinates.longitude, coordinates.latitude);
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
  getReducedActive: asyncHelper((req, res) => getAllActive(req, res, true)),
  getFullActive: asyncHelper((req, res) => getAllActive(req, res, false)),
};
