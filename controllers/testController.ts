import { Request, Response } from 'express';

import dbPsychologists from '../db/psychologists';
import seed from '../test/helper/fake_data';
import db from '../db/db';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import loginInformations from '../services/loginInformations';

const getPsychologist = async (req: Request, res: Response): Promise<void> => {
  try {
    const psy = await dbPsychologists.getAcceptedByEmail(req.params.email);
    const xsrfToken = loginInformations.generateToken();

    const jwtToken = jwt.sign(
      { psychologist: psy.dossierNumber, xsrfToken },
      config.secret,
      { expiresIn: '2h' },
    );

    res.json({
      psy,
      token: jwtToken,
      xsrfToken,
    });
  } catch (err) {
    res.status(500).json('Oops');
  }
};

const resetDB = async (req: Request, res: Response) : Promise<void> => {
  await seed(db, true);
  res.status(200).json('DB reset');
};

const removeConvention = async (req: Request, res: Response) : Promise<void> => {
  await dbPsychologists.deleteConventionInfo(req.params.email);
  res.status(200).json('Convention removed');
};

const resetTutorial = async (req: Request, res: Response) : Promise<void> => {
  await dbPsychologists.resetTutorial(req.params.email);
  res.status(200).json('Tuto reseted');
};

export default {
  getPsychologist,
  resetDB,
  removeConvention,
  resetTutorial,
};
