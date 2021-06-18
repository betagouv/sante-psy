const knexConfig = require('../knexfile.ts');
const knex = require('knex')(knexConfig);
const date = require('../utils/date');
const { psychologistsTable, suspensionReasonsTable } = require('./tables');
const { DOSSIER_STATE } = require('../utils/dossierState');
const dbUniversities = require('./universities');
const {
  addFrenchLanguageIfMissing,
  editablePsyFields,
  nonEditablePsyFields,
} = require('../services/updatePsyFields');

module.exports.getAcceptedPsychologists = async (selectedData) => {
  try {
    const psychologists = knex.column(...selectedData)
        .select()
        .from(psychologistsTable)
        .whereNot('archived', true)
        .where('state', DOSSIER_STATE.accepte);
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

module.exports.getActivePsychologists = async () => {
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
        .where('state', DOSSIER_STATE.accepte)
        .andWhere('active', true)
        .orderByRaw('RANDOM ()');
    return psychologists;
  } catch (err) {
    console.error('Impossible de récupérer les psychologistes', err);
    throw new Error('Impossible de récupérer les psychologistes');
  }
};

const getPsychologistsByIds = async (ids) => {
  try {
    const groupById = {};
    const psychologists = await knex(psychologistsTable)
      .whereIn('dossierNumber', ids);
    psychologists.forEach((psychologist) => {
      groupById[psychologist.dossierNumber] = psychologist;
    });
    return groupById;
  } catch (err) {
    console.error('Impossible de récupérer les psychologues', err);
    throw new Error('Impossible de récupérer les psychologues');
  }
};

const getPsychologistById = async (psychologistId) => {
  try {
    const psychologist = await knex(psychologistsTable)
      .where('dossierNumber', psychologistId)
      .first();
    return psychologist;
  } catch (err) {
    console.error('Impossible de récupérer le psychologue', err);
    throw new Error('Impossible de récupérer le psychologue');
  }
};
module.exports.getPsychologistById = getPsychologistById;

/**
 * Perform a UPSERT with https://knexjs.org/#Builder-merge
 * @param {*} psy
 */
module.exports.savePsychologistInPG = async function savePsychologistInPG(psyList) {
  console.log(`UPSERT of ${psyList.length} psychologists into PG....`);
  const updatedAt = date.getDateNowPG(); // use to perform UPSERT in PG
  const universities = await dbUniversities.getUniversities();

  const psychologists = await getPsychologistsByIds(psyList.map((psy) => psy.dossierNumber));
  const psychologistsToInsert = [];
  const upsertArray = psyList.map(async (psy) => {
    try {
      const psyInDb = psychologists[psy.dossierNumber];
      if (!psyInDb) {
        psychologistsToInsert.push({
          ...psy,
          languages: addFrenchLanguageIfMissing(psy.languages),
          assignedUniversityId: dbUniversities.getAssignedUniversityId(psy, universities),
        });
        return Promise.resolve();
      }

      if (psyInDb.selfModified) {
        return knex(psychologistsTable)
        .where({ dossierNumber: psy.dossierNumber })
        .update({
          ...nonEditablePsyFields(psy),
          updatedAt,
        });
      }

      return knex(psychologistsTable)
      .where({ dossierNumber: psy.dossierNumber })
      .update({
        ...editablePsyFields(psy),
        ...nonEditablePsyFields(psy),
        // assignedUniversityId, do not update assignedId on already existing psy
        updatedAt,
      });
    } catch (err) {
      console.error(`Error to insert ${psy}`, err);
      return Promise.resolve();
    }
  });

  upsertArray.push(
    knex(psychologistsTable)
    .insert(psychologistsToInsert),
  );
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
  .where('state', DOSSIER_STATE.accepte)
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
    this.where('state', DOSSIER_STATE.en_construction)
      .orWhere('state', DOSSIER_STATE.en_instruction);
  })
  .andWhere('personalEmail', email)
  .first();
};

module.exports.countAcceptedPsychologistsByPersonalEmail = () => knex(psychologistsTable)
    .select('personalEmail', 'state')
    .where('state', DOSSIER_STATE.accepte)
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
    .select(`${'universities'}.name as universityName`,
      `${'universities'}.id as universityId`,
      `${psychologistsTable}.isConventionSigned`)
    .innerJoin('universities',
      `${psychologistsTable}.assignedUniversityId`,
      `${'universities'}.id`)
    .where(`${psychologistsTable}.dossierNumber`, psychologistId)
    .first();

module.exports.deleteConventionInfo = (email) => knex
  .from(psychologistsTable)
  .update({
    assignedUniversityId: null,
  })
  .where('personalEmail', email);

module.exports.updatePsychologist = async (psychologist) => {
  try {
    return knex(psychologistsTable)
      .where('dossierNumber', psychologist.dossierNumber)
      .update({
        ...editablePsyFields(psychologist),
        updatedAt: date.getDateNowPG(),
        selfModified: true,
      });
  } catch (err) {
    console.error('Erreur de modification du psychologue', err);
    throw new Error('Erreur de modification du psychologue');
  }
};

module.exports.activate = async (dossierNumber) => {
  try {
    return knex(psychologistsTable)
      .where({ dossierNumber })
      .update({
        active: true,
        inactiveUntil: null,
      });
  } catch (err) {
    console.error('Erreur d\'activation du psychologue', err);
    throw new Error('Erreur d\'activation du psychologue');
  }
};

module.exports.suspend = async (dossierNumber, inactiveUntil, reason) => knex.transaction((trx) => {
  const update = knex(psychologistsTable)
      .transacting(trx)
      .where({ dossierNumber })
      .update({
        active: false,
        inactiveUntil,
      });
  const create = knex(suspensionReasonsTable)
      .transacting(trx)
      .insert({
        psychologistId: dossierNumber,
        reason,
        until: inactiveUntil,
      });

  Promise.all([update, create])
      .then(() => {
        trx.commit();
        console.log(`Psychologue ${dossierNumber} suspendu jusqu'au ${inactiveUntil}`);
      })
      .catch((err) => {
        trx.rollback();
        console.error('Erreur de suspension du psychologue', err);
        throw new Error('Erreur de suspension du psychologue');
      });
});

module.exports.reactivate = () => knex(psychologistsTable)
    .where({ active: false })
    .andWhere('inactiveUntil', '<=', (new Date()).toISOString())
    .update({ active: true, inactiveUntil: null });
