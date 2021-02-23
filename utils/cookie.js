const jwt = require('jsonwebtoken');
const config = require('../utils/config');

/**
 * get a json web token
 * token = encodeBase64(header) + '.' + encodeBase64(payload) + '.' + encodeBase64(signature)
 * @param {*} id
 * @see https://www.ionos.fr/digitalguide/sites-internet/developpement-web/json-web-token-jwt/ 
 */
module.exports.getJwtTokenForUser = function getJwtTokenForUser(email) {
  return jwt.sign(
    { email : email },
    config.secret,
    { expiresIn: '2 hours' }
  );
};

module.exports.verifyJwt = function verifyJwt(token) {
  try {
    const verified = jwt.verify(token, config.secret);
    return verified.email;
  } catch (err) {
    console.log("invalid token");
    return false;
  }
}