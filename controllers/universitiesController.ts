import { Request, Response } from 'express';
import { param } from 'express-validator';
import dbUniversities from '../db/universities';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';
import CustomError from '../utils/CustomError';

const getOneValidators = [
  param('universityId')
    .isUUID()
    .withMessage('Vous devez spécifier un identifiant valide.'),
];

const getOne = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const university = await dbUniversities.getById(req.params.universityId);

  if (!university) {
    throw new CustomError("L'université n'existe pas.", 500);
  }

  res.json({
    name: university.name,
    siret: university.siret,
    address: university.address,
    postal_code: university.postal_code,
    city: university.city,
  });
};

export default {
  getOneValidators,
  getOne: asyncHelper(getOne),
};
