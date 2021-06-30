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
const getJwtTokenForUser = function getJwtTokenForUser(psychologist, xsrfToken) {
  const duration = getSessionDuration();

  return jwt.sign(
    {
      psychologist,
      xsrfToken,
    },
    config.secret,
    { expiresIn: duration },
  );
};
module.exports.getJwtTokenForUser = getJwtTokenForUser;

module.exports.createAndSetJwtCookie = (res, psychologistData, xsrfToken) => {
  const jwtToken = getJwtTokenForUser(psychologistData, xsrfToken);
  res.cookie('token', jwtToken, headers);
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
      throw new CustomError('Votre session a expiré, veuillez vous reconnecter.', 498);
    }
    console.debug('Invalid token: ', err);
    return false;
  }
};
module.exports.verifyJwt = verifyJwt;
