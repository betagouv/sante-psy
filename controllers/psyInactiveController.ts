import { Request, Response } from 'express';
import { check } from 'express-validator';
import DOMPurify from '../services/sanitizer';

import validation from '../utils/validation';
import dbPsychologists from '../db/psychologists';
import asyncHelper from '../utils/async-helper';

const suspendValidators = [
  check('reason')
    .trim().not().isEmpty()
    .withMessage('Vous devez spécifier une raison.')
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier une raison.'),
];

const suspend = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  await dbPsychologists.inactive(req.params.token, req.body.reason);

  res.json({
    message: 'Vos informations ne sont plus visibles sur l\'annuaire.',
  });
};

const activate = async (req: Request, res: Response): Promise<void> => {
  await dbPsychologists.active(req.params.token);

  res.json({});
};

export default {
  suspendValidators,
  suspend: asyncHelper(suspend),
  activate: asyncHelper(activate),
};
