const crypto = require('crypto');
const dbPsychologists = require('../db/psychologists');
const dbLoginToken = require('../db/loginToken');
const date = require('../utils/date');
const emailUtils = require('../utils/email');
const ejs = require('ejs');
const config = require('../utils/config');

function renderLogin(req, res, params) {
  // init params
  params.currentUser = undefined;
  params.nextPage = '/psychologue/mes-seances';

  // enrich params
  params.errors = req.flash('error');
  params.messages = req.flash('message');
  params.formUrl = config.demarchesSimplifieesUrl
  params.contactEmail = res.locals.contactEmail;
  // render
  return res.render('login', params);
}

function generateToken() {
  return crypto.randomBytes(256).toString('base64');
}

async function sendLoginEmail(email, loginUrl, token) {
  const user = await dbPsychologists.getPsychologistByEmail(email);

  if (!user) { //@TODO isValidUser(user)
    throw new Error(
      `Avez-vous une rempli la démarche pour devenir partenaire présente sur l'accueil du site ?`,
    );
  }

  const html = await ejs.renderFile('./views/emails/login.ejs', {
    loginUrlWithToken: `${loginUrl}?token=${encodeURIComponent(token)}`,
  });

  try {
    await emailUtils.sendMail(email, 'Connexion à Santé Psy Étudiants', html);
  } catch (err) {
    console.error(err);
    throw new Error("Erreur d'envoi de mail");
  }
}

async function saveToken(email, token) {
  try {
    const expiredAt = date.getDatePlusOneHour();
    await dbLoginToken.insert(token,email, expiredAt);

    console.log(`Login token créé pour ${email}`);
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}

module.exports.getLogin = async function getLogin(req, res) {
  renderLogin(req, res, {});
};

//@TODO test in local - we certainly have to use http
function generateLoginUrl(host) {
  const secretariatUrl = `https://${host}`;
  return secretariatUrl + '/psychologue/mes-seances';
}

/**
 * Send a email with a login link if the email is already registered
 */
module.exports.postLogin = async function postLogin(req, res) {
  const email = req.sanitize(req.body.email);

  //@TODO check if email exists (express-validator)
  if( !email  ) {
    req.flash('error', "Désolé, l'email renseigné n'a pas le bon format.");
    return res.redirect(`psychologue/login`);
  }

  try {
    const token = generateToken(req.get('host'));

    const loginUrl = generateLoginUrl(req.get('host'));

    const emailExist = await dbPsychologists.getPsychologistByEmail(email);

    if( emailExist ) {
      await sendLoginEmail(email, loginUrl, token);
      await saveToken(email, token);
    } else {
      console.warn(`Email inconnu qui essaye d'accéder au service ${email} - il est peut être en attente de validation`)
    }

    return renderLogin(req, res, {
      messages: req.flash('message', `Un lien de connexion a été envoyé à l'adresse ${email}\
       si elle est connue de nos services. Le lien est valable une heure.`),
    });
  } catch (err) {
    console.error(err);
    req.flash('error', "Erreur de l'authentification. Nos services ont été alertés.");
    return res.redirect(`/login`);
  }
};
