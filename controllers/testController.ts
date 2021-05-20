import { Request, Response } from 'express';

const dbPsychologists = require('../db/psychologists');
const dbLoginToken = require('../db/loginToken');

const getPsychologist = async (req: Request, res: Response): Promise<void> => {
  try {
    const psy = await dbPsychologists.getAcceptedPsychologistByEmail(req.params.email);
    const token = await dbLoginToken.getByEMail(req.params.email);
    res.json({
      psy,
      token: token.token,
    });
  } catch (err) {
    res.status(500).send('Ooops');
  }
};

export default {
  getPsychologist,
};
