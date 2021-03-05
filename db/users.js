const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

module.exports.usersTable =  "users";

module.exports.insertUser = async (email, psychologistId) => {
  try {
    const insertedArray = await knex(module.exports.usersTable).insert({
      email,
      psychologistId,
    }).returning("*")
    return insertedArray[0]
  } catch (err) {
    console.error("Erreur de sauvegarde du user", err)
    throw new Error("Erreur de sauvegarde du user")
  }
}

module.exports.getNumberOfUsers = async function getNumberOfUsers() {
  const query = await knex(module.exports.usersTable)
    .count('*');

  return query;
}

