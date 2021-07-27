import { Request, Response } from 'express';

import dbPsychologists from '../db/psychologists';
import dbLoginToken from '../db/loginToken';

import seed from '../test/helper/fake_data';
import db from '../db/db';

const getPsychologist = async (req: Request, res: Response): Promise<void> => {
  try {
    const psy = await dbPsychologists.getAcceptedByEmail(req.params.email);
    const token = await dbLoginToken.getByEmail(req.params.email);

    res.json({
      psy,
      token: token ? token.token : undefined,
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

export default {
  getPsychologist,
  resetDB,
  removeConvention,
};
