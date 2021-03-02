const jwt = require('jsonwebtoken');
const config = require('../utils/config');
/**
 * get a json web token to store psychologist data
 * token = encodeBase64(header) + '.' + encodeBase64(payload) + '.' + encodeBase64(signature)
 * @param {*} id
 * @see https://www.ionos.fr/digitalguide/sites-internet/developpement-web/json-web-token-jwt/
 */
module.exports.getJwtTokenForUser = function getJwtTokenForUser(email, psychologist) {
  const duration = getSessionDuration();

  return jwt.sign(
    {
      email : email,
      psychologist : psychologist,
    },
    config.secret,
    { expiresIn: duration }
  );
};

function getSessionDuration() {
  return config.sessionDurationHours + ' hours'
}

/**
 * if valid token will return psychologist data
 * @param {*} token
 */
const verifyJwt = function verifyJwt(token) {
  try {
    const verified = jwt.verify(token, config.secret);
    return verified;
  } catch (err) {
    console.debug("invalid token");
    return false;
  }
}
module.exports.verifyJwt = verifyJwt

/**
 *  Get currently logged in psy's id
 */
module.exports.getCurrentPsyId = (req) => {
  const jwtToken = req.cookies.token
  const tokenData = verifyJwt(jwtToken)
  if (!tokenData) {
    throw new Error('JWT token invalid')
  }
  const psyUuid = tokenData.psychologist.dossierNumber
  return psyUuid
}
