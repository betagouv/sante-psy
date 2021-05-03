const crypto = require('crypto');
const { check } = require('express-validator');
const ejs = require('ejs');
const validation = require('../utils/validation');
const dbPsychologists = require('../db/psychologists');
const dbLoginToken = require('../db/loginToken');
const date = require('../utils/date');
const cookie = require('../utils/cookie');
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
      loginUrlWithToken: `${loginUrl}?token=${encodeURIComponent(token)}`,
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

module.exports.getLogin = async function getLogin(req, res) {
  const nextPage = '/psychologue/mes-seances';

  const { sessionDurationHours } = config;
  const formUrl = config.demarchesSimplifieesUrl;

  // Save a token in cookie that expire after config.sessionDurationHours hours if user is logged
  try {
    if (req.query.token) {
      const token = req.sanitize(req.query.token);
      const dbToken = await dbLoginToken.getByToken(token);

      if (dbToken !== undefined) {
        const psychologistData = await dbPsychologists.getAcceptedPsychologistByEmail(dbToken.email);
        cookie.createAndSetJwtCookie(res, dbToken.email, psychologistData.dossierNumber);
        await dbLoginToken.delete(token);
        req.flash('info', `Vous êtes authentifié comme ${dbToken.email}`);
        console.log(`Successful authentication for ${logs.hashForLogs(dbToken.email)}`);
        return res.redirect(nextPage);
      }
      console.log(`Invalid or expired token received : ${token.substring(0, 5)}...`);
      req.flash('error', 'Ce lien est invalide ou expiré. Indiquez votre email ci dessous pour en avoir un nouveau.');
    }
  } catch (err) {
    console.error(err);
    req.flash('error', 'Ce lien est invalide ou expiré. Indiquez votre email ci dessous pour en avoir un nouveau.');
  }

  return res.render('login', {
    formUrl,
    sessionDurationHours,
  });
};

function generateLoginUrl() {
  return `${config.hostnameWithProtocol}/psychologue/login`;
}

/**
 * Send a email with a login link if the email is already registered
 */
module.exports.postLogin = async function postLogin(req, res) {
  if (!validation.checkErrors(req)) {
    return res.redirect('/psychologue/login');
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
      req.flash('info', `Un lien de connexion a été envoyé à l'adresse ${email}. Le lien est valable une heure.`);
    } else {
      const notYetAcceptedEmailExist = await dbPsychologists.getNotYetAcceptedPsychologistByEmail(email);
      if (notYetAcceptedEmailExist) {
        await sendNotYetAcceptedEmail(email);
        req.flash('info', 'Votre compte n\'est pas encore validé par nos services, veuillez rééssayer plus tard.');
      } else {
        req.flash('error', `L'email ${email} est inconnu, ou est lié à un dossier classé sans suite ou refusé.`);
        console.warn(`Email inconnu -ou sans suite ou refusé- qui essaye d'accéder au service : \
         ${logs.hashForLogs(email)}`);
      }
    }

    return res.redirect('/psychologue/login');
  } catch (err) {
    console.error(err);
    req.flash('error', "Erreur dans l'authentification. Nos services ont été alertés et vont règler ça au plus vite.");
    return res.redirect('/psychologue/login');
  }
};

module.exports.getLogout = function getLogout(req, res) {
  cookie.clearJwtCookie(res);
  req.flash('info', 'Vous êtes déconnecté.');
  res.redirect('/psychologue/login');
};
