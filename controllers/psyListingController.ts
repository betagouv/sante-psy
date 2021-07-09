import { Request, Response } from 'express';

import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';

const getActivePsychologists = async (req: Request, res: Response): Promise<void> => {
  const time = `getting all active psychologists from Postgres (query id #${Math.random().toString()})`;
  console.time(time);
  const psyList = await dbPsychologists.getActivePsychologists();
  console.timeEnd(time);

  res.json(psyList);
};

export default {
  getActivePsychologists: asyncHelper(getActivePsychologists),
};
