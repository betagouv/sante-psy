import { Request, Response } from 'express';

import { check } from 'express-validator';
import dbPsychologists from '../db/psychologists';
import validation from '../utils/validation';
import asyncHelper from '../utils/async-helper';

const conventionInfoValidators = [
  // Note : no sanitizing because isUUID will not allow strange html anyway.
  check('universityId')
    .isUUID()
    .withMessage('Vous devez choisir une université.'),
  // Note : no sanitizing because only 2 possible values, so will not allow strange html anyway.
  check('isConventionSigned')
    .isBoolean()
    .withMessage('Vous devez spécifier si la convention est signée ou non.'),
];

const conventionInfo = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  const { universityId, isConventionSigned } = req.body;

  const psychologistId = req.user.psychologist;
  await dbPsychologists.updateConventionInfo(psychologistId, universityId, isConventionSigned);
  const convention = await dbPsychologists.getConventionInfo(psychologistId);
  res.json({
    message: 'Vos informations de conventionnement sont bien enregistrées.',
    convention,
  });
};

export default {
  conventionInfoValidators,
  conventionInfo: asyncHelper(conventionInfo),
};
