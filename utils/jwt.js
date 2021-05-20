const jwt = require('jsonwebtoken');
const config = require('./config');

function getSessionDuration() {
  return `${config.sessionDurationHours} hours`;
}

/**
 * get a json web token to store psychologist data
 * token = encodeBase64(header) + '.' + encodeBase64(payload) + '.' + encodeBase64(signature)
 * @param {*} id
 * @see https://www.ionos.fr/digitalguide/sites-internet/developpement-web/json-web-token-jwt/
 */
const getJwtTokenForUser = function getJwtTokenForUser(email, psychologist) {
  const duration = getSessionDuration();

  return jwt.sign(
    {
      email,
      psychologist,
    },
    config.secret,
    { expiresIn: duration },
  );
};
module.exports.getJwtTokenForUser = getJwtTokenForUser;

/**
 * if valid token will return psychologist data
 * @param {*} token
 */
const verifyJwt = function verifyJwt(token) {
  try {
    const verified = jwt.verify(token, config.secret);
    return verified;
  } catch (err) {
    console.debug('invalid token');
    return false;
  }
};
module.exports.verifyJwt = verifyJwt;
