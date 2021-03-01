const knexConfig = require("../knexfile")
const date = require("../utils/date")
const knex = require("knex")(knexConfig)

module.exports.loginTokenTable =  "login_token";

module.exports.getByToken = async function getByToken(token) {
  try {
    const result = await knex(module.exports.loginTokenTable)
    .where('token', token)
    .andWhere('expiresAt', '>', date.getDateNowPG())
    .first();

    return result;
  } catch (err) {
    console.error(`Impossible de récupérer le token`, err)
    throw new Error(`Une erreur est survenue.`)
  }
}

module.exports.insert = async ( token, email, expiresAt) => {
  try {
    return await knex(module.exports.loginTokenTable).insert({
      token,
      email,
      expiresAt
    });
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}
