import { Request } from 'express';

import { check } from 'express-validator';
import ejs from 'ejs';
import logs from '../utils/logs';
import sendEmail from '../utils/email';
import config from '../utils/config';
import loginInformations from '../services/loginInformations';

const emailValidators = [
  check('email')
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
];

async function sendStudentLoginEmail(req: Request): Promise<void> {
  const { email } = req.body;
  const token = loginInformations.generateToken(32);
  const loginUrl = loginInformations.generateLoginUrl();
  try {
    const html = await ejs.renderFile('./views/emails/studentLogin.ejs', {
      loginUrlWithToken: `${loginUrl}/${encodeURIComponent(token)}`,
      appName: config.appName,
      loginUrl,
    });
    await sendEmail(email, `Connexion à ${config.appName}`, html);
    console.log(`Login email sent for ${logs.hash(email)}`);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail - sendStudentLoginEmail");
  }
}

// check psy controller to reproduce all login methods

export default {
  emailValidators,
  sendStudentLoginEmail,
};
