import { Request, Response } from 'express';
import { purifySanitizer } from '../services/sanitizer';
import { check } from 'express-validator';
import Crisp from 'crisp-api';

import validation from '../utils/validation';
import asyncHelper from '../utils/async-helper';
import config from '../utils/config';

const CrispClient = new Crisp();

CrispClient.setTier('plugin');
CrispClient.authenticate(config.crisp.identifier, config.crisp.key);

const sendValidators = [
  check('name')
    .trim().not().isEmpty()
    .customSanitizer(purifySanitizer)
    .withMessage('Vous devez spécifier un nom.'),
  check('firstName')
    .trim().not().isEmpty()
    .customSanitizer(purifySanitizer)
    .withMessage('Vous devez spécifier un prénom.'),
  check('email')
    .trim().not().isEmpty()
    .withMessage('Vous devez spécifier un email valide.')
    .customSanitizer(purifySanitizer)
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
  check('message')
    .trim().not().isEmpty()
    .customSanitizer(purifySanitizer)
    .withMessage('Vous devez spécifier un message.'),
  check('reason')
    .isIn([
      'éligibilité',
      'convention',
      'remboursement',
      'rétractation',
      'connexion',
      'presse',
      'autre-raison'])
    .withMessage('Vous devez spécifier une raison.'),
  check('user')
    .isIn(['étudiant', 'psychologue', 'autre-utilisateur'])
    .withMessage('Vous devez préciser qui vous êtes.'),
  check('navigator')
    .trim()
    .customSanitizer(purifySanitizer),
];

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
      nickname: `${req.body.firstName} ${req.body.name}`,
      email: req.body.email,
      data: { email: req.body.email, navigator: req.body.navigator },
      segments: [req.body.reason, req.body.user],
    });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore: https://github.com/crisp-im/node-crisp-api/issues/40
    await CrispClient.website.sendMessageInConversation(config.crisp.website, creation.session_id, {
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
