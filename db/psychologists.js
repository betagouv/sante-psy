const knexConfig = require("../knexfile")
const knex = require("knex")(knexConfig)
const date = require("../utils/date")
const demarchesSimplifiees = require("../utils/demarchesSimplifiees")

module.exports.psychologistsTable =  "psychologists";


module.exports.getPsychologists = async () => {
  try {
    const psychologists = knex.column(
      knex.raw('UPPER("lastName") as "lastName"'), // force to use quote otherwise knex understands it as "lastname"
      'adeli',
      'firstNames',
      'email',
      'address',
      'departement',
      'region',
      'phone',
      'website',
      'teleconsultation',
      'languages',
      'description')
        .select()
        .from(module.exports.psychologistsTable)
        .whereNot('archived', true)
        .where('state', demarchesSimplifiees.DOSSIER_STATE.accepte);
    return psychologists;
  } catch (err) {
    console.error(`Impossible de récupérer les psychologistes`, err)
    throw new Error(`Impossible de récupérer les psychologistes`)
  }
}

/**
 * Perform a UPSERT with https://knexjs.org/#Builder-merge
 * @param {*} psy
 */
module.exports.savePsychologistInPG = async function savePsychologistInPG(psyList) {
  console.log(`UPSERT of ${psyList.length} psychologists into PG....`);
  const updatedAt = date.getDateNowPG(); // use to perform UPSERT in PG

  const upsertArray = psyList.map( psy => {
    const upsertingKey = 'dossierNumber';
    try {
      return knex(module.exports.psychologistsTable)
      .insert(psy)
      .onConflict(upsertingKey)
      .merge({ // update every field and add updatedAt
        firstNames : psy.firstNames,
        lastName : psy.lastName,
        archived : psy.archived,
        state : psy.state,
        address: psy.address,
        region: psy.region,
        departement: psy.departement,
        phone: psy.phone,
        website: psy.website,
        email: psy.email,
        personalEmail: psy.personalEmail,
        teleconsultation: psy.teleconsultation,
        description: psy.description,
        training: psy.training,
        adeli: psy.adeli,
        diploma: psy.diploma,
        languages: psy.languages,
        updatedAt: updatedAt
      });
    } catch (err) {
      console.error(`Error to insert ${psy}`, err);
    }
  });

  const query = await Promise.all(upsertArray);

  console.log(`UPSERT into PG : done`);

  return query;
}

module.exports.getNumberOfPsychologists = async function getNumberOfPsychologists() {
  const query = await knex(module.exports.psychologistsTable)
  .select('archived', 'state')
  .count('*')
  .groupBy('archived', 'state');

  return query;
}


/**
 * Only return accepted psychologist
 * @param {*} email
 */
module.exports.getAcceptedPsychologistByEmail = async function getAcceptedPsychologistByEmail(email) {
  return await knex(module.exports.psychologistsTable)
  .where('state', demarchesSimplifiees.DOSSIER_STATE.accepte)
  .andWhere('personalEmail', email)
  .first()
}

/**
 * used to send email to not yet accepted users, instead of nothing
 * it can be tricky if there are multiple dossiers for the same personal emails
 */
module.exports.getNotYetAcceptedPsychologistByEmail = async function getNotYetAcceptedPsychologistByEmail(email) {
  return await knex(module.exports.psychologistsTable)
  .where(function groupWhereOrTogether() {
    this.where('state', demarchesSimplifiees.DOSSIER_STATE.en_construction)
      .orWhere('state', demarchesSimplifiees.DOSSIER_STATE.en_instruction)
  })
  .andWhere('personalEmail', email)
  .first();
}

module.exports.countAcceptedPsychologistsByPersonalEmail = async () => {
  return await knex(module.exports.psychologistsTable)
    .select('personalEmail', 'state')
    .where('state', demarchesSimplifiees.DOSSIER_STATE.accepte)
    .count('*')
    .groupBy('personalEmail', 'state');
}

