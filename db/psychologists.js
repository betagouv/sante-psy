const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

module.exports.psychologistsTable =  "psychologists";

module.exports.getPsychologists = async () => {
  try {
    const psychologists = await knex(module.exports.psychologistsTable)
        .select();

    return psychologists;
  } catch (err) {
    console.error(`Impossible de récupérer les psychologistes`, err)
    throw new Error(`Impossible de récupérer les psychologistes`)
  }
}