import { Request, Response } from 'express';

import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';

const getPsychologists = async (req: Request, res: Response): Promise<void> => {
  const time = `getting all psychologists from Postgres (query id #${Math.random().toString()})`;
  console.time(time);
  const psyList = await dbPsychologists.getActivePsychologists();
  console.timeEnd(time);

  res.json({
    success: true,
    psyList,
  });
};

export default {
  getPsychologists: asyncHelper(getPsychologists),
};
