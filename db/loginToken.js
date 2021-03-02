const knexConfig = require("../knexfile")
const date = require("../utils/date")
const knex = require("knex")(knexConfig)

const loginTokenTable = "login_token";
module.exports.loginTokenTable =  loginTokenTable;

module.exports.getByToken = async function getByToken(token) {
  try {
    const result = await knex(loginTokenTable)
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
    return await knex(loginTokenTable).insert({
      token,
      email,
      expiresAt
    });
  } catch (err) {
    console.error(`Erreur de sauvegarde du token : ${err}`);
    throw new Error('Erreur de sauvegarde du token');
  }
}

module.exports.delete = async (token) => {
  try {
    const deletedToken = await knex(loginTokenTable)
    .where({
      token: token
    })
    .del()
    .returning('*');

    if (deletedToken.length === 0) {
      console.error("token not deleted : does not exist or is not allowed")
      throw new Error("token not deleted : does not exist or is not allowed")
    }
  } catch (err) {
    console.error(`Erreur de suppression du token : ${err}`);
    throw new Error('Erreur de suppression du token');
  }
}
