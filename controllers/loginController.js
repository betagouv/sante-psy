const crypto = require('crypto');
const dbPsychologists = require('../db/psychologists');
const dbLoginToken = require('../db/loginToken');
const date = require('../utils/date');
const cookie = require('../utils/cookie');
const emailUtils = require('../utils/email');
const ejs = require('ejs');
const config = require('../utils/config');

function generateToken() {
  return crypto.randomBytes(256).toString('base64');
}

async function sendLoginEmail(email, loginUrl, token) {
  try {
    const html = await ejs.renderFile('./views/emails/login.ejs', {
      loginUrlWithToken: `${loginUrl}?token=${encodeURIComponent(token)}`,
      appName: config.appName,
    });
    await emailUtils.sendMail(email, `Connexion à ${config.appName}`, html);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail");
  }
}

async function saveToken(email, token) {
  try {
    const expiredAt = date.getDatePlusOneHour();
    await dbLoginToken.insert(token, email, expiredAt);

    console.log(`Login token créé`);
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}

module.exports.getLogin = async function getLogin(req, res) {
  const nextPage = '/psychologue/mes-seances';

  const sessionDurationHours = config.sessionDurationHours;
  const formUrl = config.demarchesSimplifieesUrl;
  const contactEmail = res.locals.contactEmail;

  // Save a token in cookie that expire after config.sessionDurationHours hours if user is logged
  try {
    if ( req.query.token ) {
      const token = req.sanitize(req.query.token);
      const dbToken = await dbLoginToken.getByToken(token);

      if( dbToken !== undefined ) {
        const psychologistData = await dbPsychologists.getPsychologistByEmail(dbToken.email);
        res.cookie('token', cookie.getJwtTokenForUser(dbToken.email, psychologistData));
        await dbLoginToken.delete(token);
        req.flash('info', `Vous êtes authentifié comme ${dbToken.email}`);

        return res.redirect(nextPage);
      } else {
        req.flash('error', 'Ce lien est invalide ou expiré. Indiquez votre email ci dessous pour en avoir un nouveau.');
      }
    }
  } catch (err) {
    console.error(err);
    req.flash('error', "Ce lien est invalide ou expiré. Indiquez votre email ci dessous pour en avoir un nouveau.");
  }

  res.render('login', {
    formUrl,
    contactEmail,
    sessionDurationHours
  });
};

function generateLoginUrl() {
  return config.hostnameWithProtocol + '/psychologue/login';
}

/**
 * Send a email with a login link if the email is already registered
 */
module.exports.postLogin = async function postLogin(req, res) {
  const email = req.sanitize(req.body.email);

  //@TODO check if email exists (express-validator)
  if( !email  ) {
    req.flash('error', "Désolé, l'email renseigné n'a pas le bon format.");
    return res.redirect(`/psychologue/login`);
  }

  try {
    const emailExist = await dbPsychologists.getPsychologistByEmail(email);

    if( emailExist ) {
      const token = generateToken();
      const loginUrl = generateLoginUrl();
      await sendLoginEmail(email, loginUrl, token);
      await saveToken(email, token);
    } else {
      console.warn(`Email inconnu qui essaye d'accéder au service - ${email} -\
      il est peut être en attente de validation`);
    }

    req.flash('info',
      `Un lien de connexion a été envoyé à l'adresse ${email}\
       si elle est connue de nos services.\nLe lien est valable une heure.`);

    return res.redirect(`/psychologue/login`);
  } catch (err) {
    console.error(err);
    req.flash('error', "Erreur dans l'authentification. Nos services ont été alertés et vont règler ça au plus vite.");
    return res.redirect(`/psychologue/login`);
  }
};

module.exports.getLogout = function getLogout (req, res) {
  req.flash('info', `Vous êtes déconnecté.`);
  res.clearCookie('token').redirect('/');
};
