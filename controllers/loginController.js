const crypto = require('crypto');
const { check } = require('express-validator');
const ejs = require('ejs');
const validation = require('../utils/validation');
const dbPsychologists = require('../db/psychologists');
const dbLoginToken = require('../db/loginToken');
const date = require('../utils/date');
const jwt = require('../utils/jwt');
const logs = require('../utils/logs');
const emailUtils = require('../utils/email');
const config = require('../utils/config');

module.exports.emailValidators = [
  check('email')
    .isEmail()
    .withMessage('Vous devez spécifier un email valide.'),
];

/**
 * @see https://www.ssi.gouv.fr/administration/precautions-elementaires/calculer-la-force-dun-mot-de-passe/
 */
function generateToken() {
  return crypto.randomBytes(64).toString('hex');
}

async function sendLoginEmail(email, loginUrl, token) {
  try {
    const html = await ejs.renderFile('./views/emails/login.ejs', {
      loginUrlWithToken: `${loginUrl}/${encodeURIComponent(token)}`,
      appName: config.appName,
      loginUrl,
    });
    await emailUtils.sendMail(email, `Connexion à ${config.appName}`, html);
    console.log(`Login email sent for ${logs.hashForLogs(email)}`);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail - sendLoginEmail");
  }
}

async function sendNotYetAcceptedEmail(email) {
  try {
    const html = await ejs.renderFile('./views/emails/loginNotAcceptedYet.ejs', {
      appName: config.appName,
    });
    await emailUtils.sendMail(email, `C'est trop tôt pour vous connecter à ${config.appName}`, html);
    console.log(`Not yet accepted email sent for ${logs.hashForLogs(email)}`);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail - sendNotYetAcceptedEmail");
  }
}

async function saveToken(email, token) {
  try {
    const expiredAt = date.getDatePlusOneHour();
    await dbLoginToken.insert(token, email, expiredAt);

    console.log(`Login token created for ${logs.hashForLogs(email)}`);
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}

module.exports.login = async function login(req, res) {
  // Save a token that expire after config.sessionDurationHours hours if user is logged
  try {
    if (req.body.token) {
      const token = req.sanitize(req.body.token);
      const dbToken = await dbLoginToken.getByToken(token);

      if (dbToken) {
        const psychologistData = await dbPsychologists.getAcceptedPsychologistByEmail(dbToken.email);
        const newToken = jwt.getJwtTokenForUser(dbToken.email, psychologistData.dossierNumber);
        await dbLoginToken.delete(token);
        console.log(`Successful authentication for ${logs.hashForLogs(dbToken.email)}`);
        return res.json({ token: newToken });
      }

      console.log(`Invalid or expired token received : ${token.substring(0, 5)}...`);
    }
  } catch (err) {
    console.error(err);
  }

  return res.json({
    success: false,
    message: 'Ce lien est invalide ou expiré. Indiquez votre email ci dessous pour en avoir un nouveau.',
  });
};

function generateLoginUrl() {
  return `${config.hostnameWithProtocol}/psychologue/login`;
}

/**
 * Send a email with a login link if the email is already registered
 */
module.exports.sendMail = async function postLogin(req, res) {
  if (!validation.checkErrors(req)) {
    return res.json({
      success: false,
      message: req.error,
    });
  }
  const { email } = req.body;

  console.log(`User with ${logs.hashForLogs(email)} asked for a login link`);
  try {
    const acceptedEmailExist = await dbPsychologists.getAcceptedPsychologistByEmail(email);
    if (acceptedEmailExist) {
      const token = generateToken();
      const loginUrl = generateLoginUrl();
      await sendLoginEmail(email, loginUrl, token);
      await saveToken(email, token);
      return res.json({
        success: true,
        message: `Un lien de connexion a été envoyé à l'adresse ${email
        }. Le lien est valable ${config.sessionDurationHours} heures.`,
      });
    }
    const notYetAcceptedEmailExist = await dbPsychologists.getNotYetAcceptedPsychologistByEmail(email);
    if (notYetAcceptedEmailExist) {
      await sendNotYetAcceptedEmail(email);
      return res.json({
        success: false,
        message: 'Votre compte n\'est pas encore validé par nos services, veuillez rééssayer plus tard.',
      });
    }
    console.warn(`Email inconnu -ou sans suite ou refusé- qui essaye d'accéder au service : ${
      logs.hashForLogs(email)}`);
    return res.json({
      success: false,
      message: `L'email ${email} est inconnu, ou est lié à un dossier classé sans suite ou refusé.`,
    });
  } catch (err) {
    console.error(err);
    return res.json({
      success: false,
      message: "Erreur dans l'authentification. Nos services ont été alertés et vont règler ça au plus vite.",
    });
  }
};
