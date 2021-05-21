const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);
const date = require('../utils/date');
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');
const dbUniversities = require('./universities');

const psychologistsTable = 'psychologists';
module.exports.psychologistsTable = psychologistsTable;

module.exports.getPsychologistsDeclaredUniversity = async () => {
  try {
    const psychologists = knex.column(
      knex.raw('UPPER("lastName") as "lastName"'), // force to use quote otherwise knex understands it as "lastname"
      'firstNames',
      'personalEmail',
      'departement',
      'dossierNumber',
      'assignedUniversityId',
      'declaredUniversityId',
    )
        .select()
        .from(psychologistsTable)
        .whereNot('archived', true)
        .where('state', demarchesSimplifiees.DOSSIER_STATE.accepte)
        .orderBy('dossierNumber');
    return psychologists;
  } catch (err) {
    console.error('Impossible de récupérer les psychologistes', err);
    throw new Error('Impossible de récupérer les psychologistes');
  }
};

module.exports.saveAssignedUniversity = async (psychologistId, assignedUniversityId) => {
  const updatedPsy = await knex(psychologistsTable)
    .where({
      dossierNumber: psychologistId,
    })
    .update({
      assignedUniversityId,
      updatedAt: date.getDateNowPG(),
    });

  console.log(`Psy id ${psychologistId} updated with assignedUniversityId ${assignedUniversityId}`);

  if (!updatedPsy) {
    throw new Error('No psychologist found for this id');
  }

  return updatedPsy;
};

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
      'description',
    )
        .select()
        .from(psychologistsTable)
        .whereNot('archived', true)
        .where('state', demarchesSimplifiees.DOSSIER_STATE.accepte)
        .orderByRaw('RANDOM ()');
    return psychologists;
  } catch (err) {
    console.error('Impossible de récupérer les psychologistes', err);
    throw new Error('Impossible de récupérer les psychologistes');
  }
};

function addFrenchLanguageIfMissing(languages) {
  const frenchRegexp = new RegExp(/fran[çc]ais/, 'g');
  const french = 'Français';
  if (!frenchRegexp.test(languages.toLowerCase())) {
    if (languages.trim().length === 0) {
      return french;
    }
    return `${french}, ${languages}`;
  }
  return languages;
}

/**
 * Perform a UPSERT with https://knexjs.org/#Builder-merge
 * @param {*} psy
 */
module.exports.savePsychologistInPG = async function savePsychologistInPG(psyList) {
  console.log(`UPSERT of ${psyList.length} psychologists into PG....`);
  const updatedAt = date.getDateNowPG(); // use to perform UPSERT in PG
  const universities = await dbUniversities.getUniversities();

  const upsertArray = psyList.map((psy) => {
    const upsertingKey = 'dossierNumber';

    psy.languages = addFrenchLanguageIfMissing(psy.languages);

    psy.assignedUniversityId = dbUniversities.getAssignedUniversityId(psy, universities);

    try {
      return knex(psychologistsTable)
      .insert(psy)
      .onConflict(upsertingKey)
      .merge({ // update every field and add updatedAt
        firstNames: psy.firstNames,
        lastName: psy.lastName,
        archived: psy.archived,
        state: psy.state,
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
        languages: addFrenchLanguageIfMissing(psy.languages),
        // assignedUniversityId, do not update assignedId on already existing psy
        updatedAt,
      });
    } catch (err) {
      console.error(`Error to insert ${psy}`, err);
      return Promise.resolve();
    }
  });

  const query = await Promise.all(upsertArray);

  console.log('UPSERT into PG : done');

  return query;
};

module.exports.getNumberOfPsychologists = async function getNumberOfPsychologists() {
  const query = await knex(psychologistsTable)
  .select('archived', 'state')
  .count('*')
  .groupBy('archived', 'state');

  return query;
};

/**
 * Only return accepted psychologist
 * @param {*} email
 */
module.exports.getAcceptedPsychologistByEmail = function getAcceptedPsychologistByEmail(email) {
  return knex(psychologistsTable)
  .where('state', demarchesSimplifiees.DOSSIER_STATE.accepte)
  .andWhere(
    knex.raw('LOWER("personalEmail") = ?', email.toLowerCase()),
  )
  .first();
};

/**
 * used to send email to not yet accepted users, instead of nothing
 * it can be tricky if there are multiple dossiers for the same personal emails
 */
module.exports.getNotYetAcceptedPsychologistByEmail = function getNotYetAcceptedPsychologistByEmail(email) {
  return knex(psychologistsTable)
  .where(function groupWhereOrTogether() {
    this.where('state', demarchesSimplifiees.DOSSIER_STATE.en_construction)
      .orWhere('state', demarchesSimplifiees.DOSSIER_STATE.en_instruction);
  })
  .andWhere('personalEmail', email)
  .first();
};

module.exports.countAcceptedPsychologistsByPersonalEmail = () => knex(psychologistsTable)
    .select('personalEmail', 'state')
    .where('state', demarchesSimplifiees.DOSSIER_STATE.accepte)
    .count('*')
    .groupBy('personalEmail', 'state');

module.exports.updateConventionInfo = async (psychologistId, assignedUniversityId, isConventionSigned) => {
  const updated = await knex(psychologistsTable)
    .where({
      dossierNumber: psychologistId,
    })
    .update({
      assignedUniversityId,
      isConventionSigned,
      updatedAt: date.getDateNowPG(),
    });
  if (!updated) {
    throw new Error('No psychologist found for this id');
  }
  return updated;
};

module.exports.getConventionInfo = (psychologistId) => knex.from(psychologistsTable)
    .select(`${dbUniversities.universitiesTable}.name as universityName`,
      `${dbUniversities.universitiesTable}.id as universityId`,
      `${psychologistsTable}.isConventionSigned`)
    .innerJoin(dbUniversities.universitiesTable,
      `${psychologistsTable}.assignedUniversityId`,
      `${dbUniversities.universitiesTable}.id`)
    .where(`${psychologistsTable}.dossierNumber`, psychologistId)
    .first();

module.exports.deleteConventionInfo = (email) => knex
  .from(psychologistsTable)
  .update({
    assignedUniversityId: null,
  })
  .where('personalEmail', email);

module.exports.getPsychologistById = async (psychologistId) => {
  try {
    const psychologist = await knex(module.exports.psychologistsTable)
      .where('dossierNumber', psychologistId)
      .first();
    return psychologist;
  } catch (err) {
    console.error('Impossible de récupérer le psychologue', err);
    throw new Error('Impossible de récupérer le psychologue');
  }
};

module.exports.updatePsychologist = async (psychologistId,
  firstNames, lastName, email, address, departement, region, phone, website,
  description, teleconsultation, languages, training, diploma, personalEmail) => {
  try {
    return await knex(module.exports.psychologistsTable)
      .where('dossierNumber', psychologistId)
      .update({
        firstNames,
        lastName,
        email,
        address,
        departement,
        region,
        phone,
        website,
        description,
        teleconsultation,
        languages,
        training: JSON.stringify(training),
        diploma,
        personalEmail,
      });
  } catch (err) {
    console.error('Erreur de modification du psychologue', err);
    throw new Error('Erreur de modification du psychologue');
  }
};
