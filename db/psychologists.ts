import knexModule from 'knex';
import date from '../utils/date';
import { psychologistsTable, suspensionReasonsTable } from './tables';
import { DossierState } from '../types/DemarcheSimplifiee';
import dbUniversities from './universities';
import {
  addFrenchLanguageIfMissing,
  editablePsyFields,
  nonEditablePsyFields,
} from '../services/updatePsyFields';
import { Psychologist } from '../types/Psychologist';

const knexConfig = require('../knexfile');

const knex = knexModule(knexConfig);

const getAllAccepted = async (selectedData: string[]) : Promise<Psychologist[]> => {
  try {
    const psychologists = knex.column(...selectedData)
        .select()
        .from(psychologistsTable)
        .where('state', DossierState.accepte);
    return psychologists;
  } catch (err) {
    console.error('Impossible de récupérer les psychologistes', err);
    throw new Error('Impossible de récupérer les psychologistes');
  }
};

const saveAssignedUniversity = async (psychologistId: string, assignedUniversityId: string): Promise<number> => {
  const updatedPsy = await knex(psychologistsTable)
    .where({
      dossierNumber: psychologistId,
    })
    .update({
      assignedUniversityId,
      updatedAt: date.now(),
    });

  console.log(`Psy id ${psychologistId} updated with assignedUniversityId ${assignedUniversityId}`);

  if (!updatedPsy) {
    throw new Error('No psychologist found for this id');
  }

  return updatedPsy;
};

const getAllActive = async (): Promise<Psychologist[]> => {
  try {
    const psychologists = knex.column(
      'dossierNumber',
      'lastName',
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
        .where('state', DossierState.accepte)
        .andWhere('active', true)
        .orderByRaw('RANDOM ()');
    return psychologists;
  } catch (err) {
    console.error('Impossible de récupérer les psychologistes', err);
    throw new Error('Impossible de récupérer les psychologistes');
  }
};

const getByIds = async (ids) => {
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

const getById = async (psychologistId: string): Promise<Psychologist> => {
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

/**
 * Perform a UPSERT with https://knexjs.org/#Builder-merge
 * @param {*} psy
 */
const savePsychologistInPG = async (psyList: Psychologist[]): Promise<(number | void)[]> => {
  console.log(`UPSERT of ${psyList.length} psychologists into PG....`);
  const updatedAt = date.now(); // use to perform UPSERT in PG
  const universities = await dbUniversities.getAllOrderByName();

  const psychologists = await getByIds(psyList.map((psy) => psy.dossierNumber));
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

  if (psychologistsToInsert.length > 0) {
    upsertArray.push(
      knex(psychologistsTable)
    .insert(psychologistsToInsert),
    );
  }
  const query = await Promise.all(upsertArray);

  console.log('UPSERT into PG : done');

  return query;
};

const countByArchivedAndState = async (): Promise<any[]> => knex(psychologistsTable)
  .select('archived', 'state')
  .count('*')
  .groupBy('archived', 'state');

/**
 * Only return accepted psychologist
 * @param {*} email
 */
const getAcceptedByEmail = async (email: string): Promise<Psychologist> => knex(psychologistsTable)
  .where('state', DossierState.accepte)
  .andWhere(
    knex.raw('LOWER("personalEmail") = ?', email.toLowerCase()),
  )
  .first();

/**
 * used to send email to not yet accepted users, instead of nothing
 * it can be tricky if there are multiple dossiers for the same personal emails
 */
const getNotYetAcceptedByEmail = async (email: string): Promise<Psychologist> => knex(psychologistsTable)
  .where(function groupWhereOrTogether() {
    this.where('state', DossierState.enConstruction)
      .orWhere('state', DossierState.enInstruction);
  })
  .andWhere('personalEmail', email)
  .first();

const countAcceptedByPersonalEmail = async (): Promise<any> => knex(psychologistsTable)
    .select('personalEmail', 'state')
    .where('state', DossierState.accepte)
    .count('*')
    .groupBy('personalEmail', 'state');

const updateConventionInfo = async (
  psychologistId: string,
  assignedUniversityId: string,
  isConventionSigned: boolean,
): Promise<number> => {
  const updated = await knex(psychologistsTable)
    .where({
      dossierNumber: psychologistId,
    })
    .update({
      assignedUniversityId,
      isConventionSigned,
      updatedAt: date.now(),
    });
  if (!updated) {
    throw new Error('No psychologist found for this id');
  }
  return updated;
};

const getConventionInfo = async (psychologistId: string): Promise<any> => knex.from(psychologistsTable)
    .select(`${'universities'}.name as universityName`,
      `${'universities'}.id as universityId`,
      `${psychologistsTable}.isConventionSigned`)
    .innerJoin('universities',
      `${psychologistsTable}.assignedUniversityId`,
      `${'universities'}.id`)
    .where(`${psychologistsTable}.dossierNumber`, psychologistId)
    .first();

const deleteConventionInfo = async (email: string): Promise<any> => knex
  .from(psychologistsTable)
  .update({
    assignedUniversityId: null,
  })
  .where('personalEmail', email);

const update = async (psychologist: Psychologist): Promise<number> => {
  try {
    return knex(psychologistsTable)
      .where('dossierNumber', psychologist.dossierNumber)
      .update({
        ...editablePsyFields(psychologist),
        updatedAt: date.now(),
        selfModified: true,
      });
  } catch (err) {
    console.error('Erreur de modification du psychologue', err);
    throw new Error('Erreur de modification du psychologue');
  }
};

const activate = async (dossierNumber: string): Promise<number> => {
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

const suspend = async (
  dossierNumber: string,
  inactiveUntil: Date,
  reason: string,
): Promise<void> => knex.transaction((trx) => {
  const updateRequest = knex(psychologistsTable)
      .transacting(trx)
      .where({ dossierNumber })
      .update({
        active: false,
        inactiveUntil,
      });
  const createRequest = knex(suspensionReasonsTable)
      .transacting(trx)
      .insert({
        psychologistId: dossierNumber,
        reason,
        until: inactiveUntil,
      });

  Promise.all([updateRequest, createRequest])
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

const reactivate = async (): Promise<number> => knex(psychologistsTable)
    .where({ active: false })
    .andWhere('inactiveUntil', '<=', (new Date()).toISOString())
    .update({ active: true, inactiveUntil: null });

export default {
  getAllActive,
  getById,
  getAcceptedByEmail,
  getNotYetAcceptedByEmail,
  getAllAccepted,
  countByArchivedAndState,
  countAcceptedByPersonalEmail,
  savePsychologistInPG,
  saveAssignedUniversity,
  activate,
  reactivate,
  suspend,
  update,
  getConventionInfo,
  updateConventionInfo,
  deleteConventionInfo,
};
