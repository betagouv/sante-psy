const jwt = require('jsonwebtoken');
const config = require('../utils/config');

const headers = {
  // secure: if true, send cookie over https only.
  // We use false when the server is not https (like localhost) otherwise we break sessions.
  secure: config.isSecure,
  // httpOnly: the browser cannot read the cookie, only send it to the server.
  httpOnly: true,
  // sameSite : browser only sends the cookie to the site it came from (our site!)
  // We use "Lax" because "Strict" breaks the login process : when you login
  // by clicking the magic link from gmail, orange mail, or other mail website with specific
  // referer-policy, the token is not passed correctly to the server (I think it is passed in
  // the original request, but not in the redirect request to the home page.)
  // Same problem can happen with CSRF cookie.
  sameSite: 'Lax',
}
module.exports.headers = headers

module.exports.createAndSetJwtCookie = (res, email, psychologistData) => {
  res.cookie('token', getJwtTokenForUser(email, psychologistData), headers);
}

module.exports.clearJwtCookie = (res) => {
  res.clearCookie('token')
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
      email : email,
      psychologist : psychologist,
    },
    config.secret,
    { expiresIn: duration }
  );
};
module.exports.getJwtTokenForUser = getJwtTokenForUser

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
  const psyUuid = tokenData.psychologist;
  return psyUuid
}
