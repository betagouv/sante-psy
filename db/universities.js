const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const date = require("../utils/date")

const universitiesTable = "universities";
module.exports.universitiesTable =  universitiesTable;

module.exports.saveUniversities = async function saveUniversities(universitiesList) {
  console.log(`UPSERT of ${universitiesList.length} unviersities into PG....`);
  const updatedAt = date.getDateNowPG(); // use to perform UPSERT in PG

  const upsertArray = universitiesList.map( university => {
    const upsertingKey = 'id';

    try {
      return knex(universitiesTable)
      .insert(university)
      .onConflict(upsertingKey)
      .merge({ // update every field and add updatedAt
        name: university.name,
        emailSSU: university.emailSSU,
        emailUniversity: university.emailUniversity,
        updatedAt: updatedAt
      });
    } catch (err) {
      console.error(`Error to insert ${university}`, err);
    }
  });

  const query = await Promise.all(upsertArray);

  console.log(`UPSERT into PG : done`);

  return query;
}


module.exports.getUniversities = async () => {
  try {
    return knex.select('id', 'name', 'emailSSU', 'emailUniversity')
        .from(universitiesTable)
        .orderBy("name")
  } catch (err) {
    console.error(`Impossible de récupérer les universités`, err)
    throw new Error(`Impossible de récupérer les universités`)
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
