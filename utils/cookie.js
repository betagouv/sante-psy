const jwt = require('jsonwebtoken');
const config = require('../utils/config');
/**
 * get a json web token to store psychologist data
 * token = encodeBase64(header) + '.' + encodeBase64(payload) + '.' + encodeBase64(signature)
 * @param {*} id
 * @see https://www.ionos.fr/digitalguide/sites-internet/developpement-web/json-web-token-jwt/ 
 */
module.exports.getJwtTokenForUser = function getJwtTokenForUser(email, psychologistData) {
  return jwt.sign(
    {
      email : email,
      psychologistData : psychologistData,
    },
    config.secret,
    { expiresIn: '2 hours' }
  );
};

/**
 * if valid token will return psychologist data
 * @param {*} token 
 */
module.exports.verifyJwt = function verifyJwt(token) {
  try {
    const verified = jwt.verify(token, config.secret);
    return verified;
  } catch (err) {
    console.debug("invalid token");
    return false;
  }
}