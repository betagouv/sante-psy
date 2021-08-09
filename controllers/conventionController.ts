import { Request, Response } from 'express';

import { check } from 'express-validator';
import dbPsychologists from '../db/psychologists';
import dbUniversities from '../db/universities';
import validation from '../utils/validation';
import asyncHelper from '../utils/async-helper';
import CustomError from '../utils/CustomError';

const updateValidators = [
  // Note : no sanitizing because isUUID will not allow strange html anyway.
  check('universityId')
    .isUUID()
    .withMessage('Vous devez choisir une université.'),
  // Note : no sanitizing because only 2 possible values, so will not allow strange html anyway.
  check('isConventionSigned')
    .isBoolean()
    .withMessage('Vous devez spécifier si la convention est signée ou non.'),
];

const update = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { universityId, isConventionSigned } = req.body;

  const noUniversityNow = await dbUniversities.getNoUniversityNow();
  if (isConventionSigned && universityId === noUniversityNow.id) {
    throw new CustomError('Impossible de signer une convention avec cette université.', 400);
  }

  const psychologistId = req.user.psychologist;
  await dbPsychologists.updateConventionInfo(psychologistId, universityId, isConventionSigned);
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
