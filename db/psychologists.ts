/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["psy"] }] */
import date from '../utils/date';
import { psychologistsTable, suspensionReasonsTable } from './tables';
import { DossierState } from '../types/DossierState';
import dbUniversities from './universities';
import {
  addFrenchLanguageIfMissing,
  editablePsyFields,
  nonEditablePsyFields,
} from '../services/updatePsyFields';
import getAddrCoordinates from '../services/getAddrCoordinates';
import { Psychologist } from '../types/Psychologist';
import { Knex } from 'knex';
import db from './db';

const getAllAccepted = async (selectedData: string[]) : Promise<Psychologist[]> => {
  try {
    const psychologists = db.column(...selectedData)
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
  const updatedPsy = await db(psychologistsTable)
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

const getAllActive = async (modifyQuery: ((queryBuilder: Knex.QueryBuilder) => void)): Promise<Psychologist[]> => {
  try {
    const psychologists = db.column(
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
        .where({
          archived: false,
          state: DossierState.accepte,
          active: true,
        })
        .modify(modifyQuery);
    return psychologists;
  } catch (err) {
    console.error('Impossible de récupérer les psychologistes', err);
    throw new Error('Impossible de récupérer les psychologistes');
  }
};

const getByIds = async (ids: string[]): Promise<{[key: string]: Psychologist}> => {
  try {
    const groupById = {};
    const psychologists = await db(psychologistsTable)
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
    const psychologist = await db(psychologistsTable)
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
const upsertMany = async (psyList: Psychologist[]): Promise<void> => {
  console.log(`UPSERT of ${psyList.length} psychologists into PG....`);
  const updatedAt = date.now(); // use to perform UPSERT in PG
  const universities = await dbUniversities.getAll();

  const psychologists = await getByIds(psyList.map((psy) => psy.dossierNumber));
  const psychologistsToInsert = [];
  const upsertArray = psyList.map(async (psy) => {
    try {
      const psyInDb = psychologists[psy.dossierNumber];
      if (!psyInDb) {
        const coordinates = await getAddrCoordinates(psy.address);
        psychologistsToInsert.push({
          ...psy,
          languages: addFrenchLanguageIfMissing(psy.languages),
          assignedUniversityId: dbUniversities.getAssignedUniversityId(psy, universities),
          ...(coordinates && coordinates.longitude && coordinates.latitude && {
            longitude: coordinates.longitude,
            latitude: coordinates.latitude,
          }),
        });
        return Promise.resolve();
      }

      if (psyInDb.selfModified) {
        return db(psychologistsTable)
        .where({ dossierNumber: psy.dossierNumber })
        .update({
          ...nonEditablePsyFields(psy),
          updatedAt,
        });
      }

      if (psyInDb.address !== psy.address) {
        const coordinates = await getAddrCoordinates(psy.address);
        if (coordinates && coordinates.longitude && coordinates.latitude) {
          psy.longitude = coordinates.longitude;
          psy.latitude = coordinates.latitude;
        }
      }

      return db(psychologistsTable)
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

  await Promise.all(upsertArray);

  if (psychologistsToInsert.length > 0) {
    await db(psychologistsTable).insert(psychologistsToInsert);
  }
  console.log('UPSERT into PG : done');
};

const countByArchivedAndState = async ()
  : Promise<{count: number, archived: boolean, state: DossierState}[]> => db(psychologistsTable)
  .select('archived', 'state')
  .count('*')
  .groupBy('archived', 'state');

const countAcceptedByPersonalEmail = async ()
  : Promise<{count: number, personalEmail: string, state: DossierState}[]> => db(psychologistsTable)
.select('personalEmail', 'state')
.where('state', DossierState.accepte)
.count('*')
.groupBy('personalEmail', 'state');

const getAcceptedByEmail = async (email: string): Promise<Psychologist> => db(psychologistsTable)
  .where('state', DossierState.accepte)
  .andWhere(
    db.raw('LOWER("personalEmail") = ?', email.toLowerCase()),
  )
  .first();

/**
 * used to send email to not yet accepted users, instead of nothing
 * it can be tricky if there are multiple dossiers for the same personal emails
 */
const getNotYetAcceptedByEmail = async (email: string): Promise<Psychologist> => db(psychologistsTable)
  .where(function groupWhereOrTogether() {
    this.where('state', DossierState.enConstruction)
      .orWhere('state', DossierState.enInstruction);
  })
  .andWhere('personalEmail', email)
  .first();

const updateConventionInfo = async (
  psychologistId: string,
  assignedUniversityId: string,
  isConventionSigned: boolean,
): Promise<number> => {
  const updated = await db(psychologistsTable)
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

const getConventionInfo = async (psychologistId: string)
  : Promise<{universityName: string, universityId: string, isConventionSigned: boolean}> => db.from(psychologistsTable)
    .select(`${'universities'}.name as universityName`,
      `${'universities'}.id as universityId`,
      `${psychologistsTable}.isConventionSigned`)
    .innerJoin('universities',
      `${psychologistsTable}.assignedUniversityId`,
      `${'universities'}.id`)
    .where(`${psychologistsTable}.dossierNumber`, psychologistId)
    .first();

const deleteConventionInfo = async (email: string): Promise<number> => db
  .from(psychologistsTable)
  .update({
    assignedUniversityId: null,
  })
  .where('personalEmail', email);

const update = async (psychologist: Psychologist): Promise<number> => {
  try {
    return db(psychologistsTable)
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
    return db(psychologistsTable)
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
): Promise<void> => db.transaction((trx) => {
  const updateRequest = db(psychologistsTable)
      .transacting(trx)
      .where({ dossierNumber })
      .update({
        active: false,
        inactiveUntil,
      });
  const createRequest = db(suspensionReasonsTable)
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

const reactivate = async (): Promise<number> => db(psychologistsTable)
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
  upsertMany,
  saveAssignedUniversity,
  activate,
  reactivate,
  suspend,
  update,
  getConventionInfo,
  updateConventionInfo,
  deleteConventionInfo,
};
