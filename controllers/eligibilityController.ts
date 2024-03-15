import { Request, Response } from 'express';
import { query, check } from 'express-validator';
import asyncHelper from '../utils/async-helper';
import validation from '../utils/validation';
import DOMPurify from '../services/sanitizer';
import studentEligibility from '../services/studentEligibility';
import config from '../utils/config';
import Crisp from 'crisp-api';

const CrispClient = new Crisp();

CrispClient.setTier('plugin');
CrispClient.authenticate(config.crisp.identifier, config.crisp.key);

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

const sendValidators = [
  check('ine')
    .trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier un numéro INE'),
  check('formation')
    .trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier une formation.'),
  check('establishment')
    .trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier un établissement.'),
  check('email')
    .trim().not().isEmpty()
    .withMessage('Vous devez spécifier un email valide.')
    .customSanitizer(DOMPurify.sanitize)
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
];

const get = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);
  const { ine } = req.query;
  const eligibility = await studentEligibility(ine.toString());
  res.json(eligibility);
};

const send = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  if (config.testEnvironment) {
    console.log('ce message aurait été envoyé... si vous etiez en prod...', req.body);
  } else {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: https://github.com/crisp-im/node-crisp-api/issues/40
    const creation = await CrispClient.website.createNewConversation(config.crisp.website);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: https://github.com/crisp-im/node-crisp-api/issues/40
    await CrispClient.website.updateConversationMetas(config.crisp.website, creation.session_id, {
      subject: 'Éligibilité étudiant',
      email: req.body.email,
      data:
      {
        email: req.body.email,
        ine: req.body.ine,
        formation: req.body.formation,
        establishment: req.body.establishment,
      },
      segments: ['éligibilité', 'étudiant', 'ine'],
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: https://github.com/crisp-im/node-crisp-api/issues/40
    await CrispClient.website.sendMessageInConversation(config.crisp.website, creation.session_id, {
      type: 'text',
      from: 'user',
      origin: 'urn:sante-psy-etudiants',
      content: `Un étudiant souhaite connaitre son éligibilité, voici ses informations :\n 
      INE: ${req.body.ine}\n
      Formation/Diplôme: ${req.body.formation}\n
      Etablissement: ${req.body.establishment}\n
      `,
    });
  }

  res.json({ message: 'Votre message a bien été envoyé. Nous reviendrons vers vous rapidement.' });
};

export default {
  getValidators,
  sendValidators,
  get: asyncHelper(get),
  send: asyncHelper(send),
};
