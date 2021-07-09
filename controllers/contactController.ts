import { Request, Response } from 'express';
import { check } from 'express-validator';
import Crisp from 'node-crisp-api';

import validation from '../utils/validation';
import asyncHelper from '../utils/async-helper';
import config from '../utils/config';

const CrispClient = new Crisp();

CrispClient.setTier('plugin');
CrispClient.authenticate(config.crisp.identifier, config.crisp.key);

const sendValidators = [
  check('name')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier un nom.'),
  check('firstName')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier un prénom.'),
  check('email')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
  check('message')
    .trim().not().isEmpty()
    .customSanitizer((value, { req }) => req.sanitize(value))
    .withMessage('Vous devez spécifier un message.'),
  check('reason')
    .isIn([
      'éligibilité',
      'convention',
      'remboursement',
      'rétractation',
      'connexion',
      'presse',
      'autre'])
    .withMessage('Vous devez spécifier une raison.'),
  check('user')
    .isIn(['étudiant', 'psychologue', 'autre'])
    .withMessage('Vous devez préciser qui vous êtes.'),
];

const send = async (req: Request, res: Response): Promise<void> => {
  validation.checkErrors(req);

  if (config.testEnvironment) {
    console.log('ce message aurait été envoyé... si vous etiez en prod...', req.body);
  } else {
    const creation = await CrispClient.websiteConversations.create(config.crisp.website);
    await CrispClient.websiteConversations.updateMeta(config.crisp.website, creation.session_id, {
      nickname: `${req.body.firstName} ${req.body.name}`,
      email: req.body.email,
      data: { email: req.body.email },
      segments: [req.body.reason, req.body.user],
    });
    await CrispClient.websiteConversations.sendMessage(config.crisp.website, creation.session_id, {
      type: 'text',
      from: 'user',
      origin: 'urn:sante-psy-etudiants',
      content: req.body.message,
    });
  }

  res.json({ message: 'Votre message a bien été envoyé. Nous reviendrons vers vous rapidement.' });
};

export default {
  sendValidators,
  send: asyncHelper(send),
};
