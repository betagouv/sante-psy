import { Request, Response } from 'express';

import dbPsychologists from '../db/psychologists';
import seed from '../test/helper/fake_data';
import db from '../db/db';
import jwt from 'jsonwebtoken';
import config from '../utils/config';
import loginInformations from '../services/loginInformations';
import dbPsyLoginToken from '../db/psyLoginToken';

const getPsychologist = async (req: Request, res: Response): Promise<void> => {
  try {
    const psy = await dbPsychologists.getAcceptedByEmail(req.params.email);
    const xsrfToken = loginInformations.generateToken();

    const token = await dbPsyLoginToken.getPsyByEmail(req.params.email);

    const duration = typeof req.query.duration === 'string' ? req.query.duration : '2h';

    const jwtToken = token && !req.query.duration ? token.token : jwt.sign(
      { psychologist: psy.dossierNumber, xsrfToken },
      config.secret,
      { expiresIn: duration },
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
