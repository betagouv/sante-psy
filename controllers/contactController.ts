import { Request, Response } from 'express';
import ejs from 'ejs';
import DOMPurify from '../services/sanitizer';
import { check } from 'express-validator';
import Crisp from 'node-crisp-api';

import validation from '../utils/validation';
import asyncHelper from '../utils/async-helper';
import config from '../utils/config';
import sendEmail from '../utils/email';

const CrispClient = new Crisp();

CrispClient.setTier('plugin');
CrispClient.authenticate(config.crisp.identifier, config.crisp.key);

const sendValidators = [
  check('name')
    .trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier un nom.'),
  check('firstName')
    .trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
    .withMessage('Vous devez spécifier un prénom.'),
  check('email')
    .trim().not().isEmpty()
    .withMessage('Vous devez spécifier un email valide.')
    .customSanitizer(DOMPurify.sanitize)
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
  check('message')
    .trim().not().isEmpty()
    .customSanitizer(DOMPurify.sanitize)
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
    .customSanitizer(DOMPurify.sanitize),
];

const mailValidator = [
  check('email')
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
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
      data: { email: req.body.email, navigator: req.body.navigator },
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

const sendStudentMail = async (req: Request, res: Response): Promise<void> => {
  const html = await ejs.renderFile('./views/emails/studentMail.ejs', {
    faq: `${config.hostnameWithProtocol}/faq`,
    parcours: `${config.hostnameWithProtocol}/static/documents/parcours_etudiant_sante_psy_etudiant.pdf`,
  });
  await sendEmail(req.body.email, `Les informations concernant ${config.appName}`, html);

  res.json({
    // eslint-disable-next-line max-len
    message: 'Nous vous avons envoyé un mail avec toutes les informations sur le dispositif. Pensez à verifier vos spams et n\'hesitez pas à nous contacter en cas de problèmes',
  });
};

export default {
  sendValidators,
  mailValidator,
  send: asyncHelper(send),
  sendStudentMail: asyncHelper(sendStudentMail),
};
