const jwt = require('jsonwebtoken');
const config = require('./config');
const { default: CustomError } = require('./CustomError');

const headers = {
  secure: !config.useCors,
  httpOnly: true,
  sameSite: 'Lax',
};
module.exports.headers = headers;

function getSessionDuration() {
  return `${config.sessionDurationHours} hours`;
}

module.exports.getSessionDuration = getSessionDuration;

/**
 * get a json web token to store psychologist data
 * token = encodeBase64(header) + '.' + encodeBase64(payload) + '.' + encodeBase64(signature)
 * @param {*} id
 * @see https://www.ionos.fr/digitalguide/sites-internet/developpement-web/json-web-token-jwt/
 */
const getJwtTokenForUser = function getJwtTokenForUser(psychologist) {
  const duration = getSessionDuration();

  return jwt.sign(
    {
      psychologist,
    },
    config.secret,
    { expiresIn: duration },
  );
};
module.exports.getJwtTokenForUser = getJwtTokenForUser;

module.exports.createAndSetJwtCookie = (res, psychologistData) => {
  const cookie = getJwtTokenForUser(psychologistData);
  res.cookie('token', cookie, headers);
};

module.exports.clearJwtCookie = (res) => {
  res.clearCookie('token');
};

/**
 * if valid token will return psychologist data
 * @param {*} token
 */
const verifyJwt = function verifyJwt(req, res) {
  try {
    const verified = jwt.verify(req.cookies.token, config.secret);
    return verified;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      res.clearCookie('token');
      throw new CustomError('Votre session a expiré, veuillez vous reconnecter.', 401);
    }
    console.debug('Invalid token: ', err);
    return false;
  }
};
module.exports.verifyJwt = verifyJwt;

/**
 *  Get currently logged in psy's id
 */
const getCurrentPsyId = (req, res) => {
  const tokenData = verifyJwt(req, res);

  if (!tokenData) {
    throw new CustomError('Token invalide', 500);
  }
  const psyUuid = tokenData.psychologist;
  return psyUuid;
};

module.exports.getCurrentPsyId = getCurrentPsyId;
