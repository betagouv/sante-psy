import { Request, Response } from 'express';
import dbUniversities from '../db/universities';
import { University } from '../types/University';
import asyncHelper from '../utils/async-helper';

const sort = (a: University, b: University): number => {
  if (a.name < b.name) { return -1; }
  if (a.name > b.name) { return 1; }
  return 0;
};

const getAll = async (req: Request, res: Response): Promise<void> => {
  let universities = [];
  universities = await dbUniversities.getAllOrderByName();

  universities.sort(sort);

  res.json(universities);
};

export default {
  getAll: asyncHelper(getAll),
};
