import { Request, Response } from 'express';
import { query } from 'express-validator';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';
import DOMPurify from '../services/sanitizer';
import studentEligibility from '../services/studentEligibility';

const getValidators = [
  query('ine').trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier un numéro INE'),
  query('ine')
    .trim().isAlphanumeric()
    .isLength({ min: 11, max: 11 })
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Le numéro INE doit être composé de 11 caractères alphanumériques \
    (chiffres ou lettres sans accents).'),
];

const get = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { ine } = req.query;
  const eligibility = await studentEligibility(ine.toString());
  res.json(eligibility);
};

export default {
  getValidators,
  get: asyncHelper(get),
};
