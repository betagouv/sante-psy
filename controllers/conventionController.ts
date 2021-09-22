import { Request, Response } from 'express';

import { check } from 'express-validator';
import dbPsychologists from '../db/psychologists';
import validation from '../utils/validation';
import asyncHelper from '../utils/async-helper';

const updateValidators = [
  check('isConventionSigned')
    .isBoolean()
    .withMessage('Vous devez spécifier si la convention est signée ou non.'),
];

const update = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { isConventionSigned } = req.body;

  const psychologistId = req.user.psychologist;
  await dbPsychologists.updateConventionInfo(psychologistId, isConventionSigned);
  const convention = await dbPsychologists.getConventionInfo(psychologistId);
  res.json({
    message: 'Vos informations de conventionnement sont bien enregistrées.',
    convention,
  });
};

export default {
  updateValidators,
  update: asyncHelper(update),
};
