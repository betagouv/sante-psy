import { Request, Response } from 'express';

import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import db from '../db/db';
import dbLoginToken from '../db/loginToken';
import dbPsychologists from '../db/psychologists';
import loginInformations from '../services/loginInformations';
import seed from '../test/helper/fake_data';
import config from '../utils/config';

const getPsychologist = async (req: Request, res: Response): Promise<void> => {
  try {
    const psy = await dbPsychologists.getAcceptedByEmail(req.params.email);
    const xsrfToken = loginInformations.generateToken();

    const token = await dbLoginToken.getByEmail(req.params.email);

    const duration = typeof req.query.duration === 'string'
      ? (req.query.duration as NonNullable<SignOptions['expiresIn']>)
      : '2h';

    const jwtToken = token && !req.query.duration ? token.token : jwt.sign(
      {
        userId: psy.dossierNumber, role: 'psy', xsrfToken, psychologist: psy.dossierNumber,
      },
      config.secret as Secret,
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

const resetDB = async (req: Request, res: Response): Promise<void> => {
  const year = typeof req.query.year === 'string' ? parseInt(req.query.year, 10) : undefined;
  await seed(db, year, true);
  res.status(200).json('DB reset');
};

const removeConvention = async (req: Request, res: Response): Promise<void> => {
  await dbPsychologists.deleteConventionInfo(req.params.email);
  res.status(200).json('Convention removed');
};

const resetTutorial = async (req: Request, res: Response): Promise<void> => {
  await dbPsychologists.resetTutorial(req.params.email);
  res.status(200).json('Tuto reseted');
};

export default {
  getPsychologist,
  resetDB,
  removeConvention,
  resetTutorial,
};
