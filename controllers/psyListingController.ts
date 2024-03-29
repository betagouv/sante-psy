import { Request, Response } from 'express';

import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';

const getAllActive = async (req: Request, res: Response, reduced: boolean): Promise<void> => {
  const [veryAvailablePsys, notVeryAvailablePsys] = await Promise.all([
    dbPsychologists.getAllActiveByAvailability(true),
    dbPsychologists.getAllActiveByAvailability(false),
  ]);
  const psyList = veryAvailablePsys.concat(notVeryAvailablePsys);

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
      city: psy.city,
      postcode: psy.postcode,
      otherAddress: psy.otherAddress,
      otherLongitude: psy.otherLongitude,
      otherLatitude: psy.otherLatitude,
      otherCity: psy.otherCity,
      otherPostcode: psy.otherPostcode,
      languages: psy.languages,
      email: psy.email,
      phone: psy.phone,
    }))
    : psyList);
};

export default {
  getReducedActive: asyncHelper((req, res) => getAllActive(req, res, true)),
  getFullActive: asyncHelper((req, res) => getAllActive(req, res, false)),
};
