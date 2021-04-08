const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)

// TODO: Gérer les imports dans un fichier centralisé
const { psychologistsTable} = require('./psychologists')
const dbPsychologists = psychologistsTable;

const universitiesTable = "universities";
module.exports.universitiesTable =  universitiesTable;

module.exports.getUniversities = async () => {
  try {
    return knex.select('id', 'name')
        .from(universitiesTable)
        .orderBy("name")
  } catch (err) {
    console.error(`Impossible de récupérer les universités`, err)
    throw new Error(`Impossible de récupérer les universités`)
  }
}

module.exports.getUniversitiesWithPsy = async () => {
  try {
    const universitiesWithPsy = await knex.from(universitiesTable)
      .innerJoin(`${dbPsychologists}`,
        `${universitiesTable}.id`,
        `${dbPsychologists}.payingUniversityId`
      )
      .select(`${universitiesTable}.id AS universityId`,
        `${dbPsychologists}.firstNames`,
        `${dbPsychologists}.lastName`,
        `${dbPsychologists}.dossierNumber AS psyId`,
        `${dbPsychologists}.personalEmail`)
    return universitiesWithPsy
  } catch (err) {
    console.error(`Impossible de récupérer les psychologues`, err)
    throw new Error(`Impossible de récupérer les psychologues`)
  }
}

module.exports.insertUniversity = async (name) => {
  try {
    const universityArray = await knex(module.exports.universitiesTable).insert({
      name,
    }).returning('*')
    return universityArray[0]
  } catch (err) {
    console.error("Erreur de sauvegarde de l'université", err)
    throw new Error("Erreur de sauvegarde de l'université")
  }
}
