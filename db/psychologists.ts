import date from '../utils/date';
import { psychologistsTable, suspensionReasonsTable } from './tables';
import { DossierState } from '../types/DossierState';
import dbUniversities from './universities';
import {
  addFrenchLanguageIfMissing,
  editablePsyFields,
  nonEditablePsyFields,
} from '../services/updatePsyFields';
import getAddressCoordinates from '../services/getAddressCoordinates';
import { Psychologist, PsychologistFilters } from '../types/Psychologist';
import db from './db';
import { Coordinates } from '../types/Coordinates';

const getAllAccepted = async (selectedData: string[]): Promise<Psychologist[]> => {
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

const selectFields = (): string[] => [
  'dossierNumber',
  'title',
  'lastName',
  'adeli',
  'firstNames',
  'email',
  'phone',
  'website',
  'appointmentLink',
  'teleconsultation',
  'languages',
  'description',
  'address',
  'longitude',
  'latitude',
  'city',
  'postcode',
  'otherAddress',
  'otherLongitude',
  'otherLatitude',
  'otherCity',
  'otherPostcode',
  'departement',
  'region',
  'diploma',
  'diplomaYear',
  'useFirstNames',
  'useLastName',
];

const getAllActive = async (): Promise<Psychologist[]> => {
  try {
    return db.select(selectFields())
      .select()
      .from(psychologistsTable)
      .whereNot('archived', true)
      .where('state', DossierState.accepte)
      .andWhere('active', true);
  } catch (err) {
    console.error('Impossible de récupérer les psychologistes', err);
    throw new Error('Impossible de récupérer les psychologistes');
  }
};

const getAllActiveByAvailability = async (isVeryAvailable: boolean, filters?: PsychologistFilters)
: Promise<Psychologist[]> => {
  try {
    let query = db.select(selectFields())
      .select()
      .from(psychologistsTable)
      .whereNot('archived', true)
      .where('state', DossierState.accepte)
      .andWhere('active', true)
      .andWhere('isVeryAvailable', isVeryAvailable);

    /* Filters */
    if (filters.name) {
      query = query.andWhere((qb) => {
        qb.whereILike('firstNames', `%${filters.name}%`)
            .orWhereILike('lastName', `%${filters.name}%`);
      });
    }
    if (filters.address) {
      query = query.andWhere((qb) => {
        qb.whereILike('address', `%${filters.address}%`)
            .orWhereILike('otherAddress', `%${filters.address}%`)
            .orWhereILike('departement', `%${filters.address}%`)
            .orWhereILike('region', `%${filters.address}%`);
      });
    }
    if (filters.language) {
      query = query.andWhereILike('languages', `%${filters.language}%`);
    }
    if (filters.speciality) {
      const specialityValue = `%${filters.speciality}%`;
      query = query.andWhere((qb) => {
        qb.whereILike('description', specialityValue)
            .orWhereILike('diploma', specialityValue)
            .orWhereRaw(
              'EXISTS (SELECT 1 FROM jsonb_array_elements_text(training::jsonb) AS elem WHERE elem ILIKE ?)',
              [specialityValue],
            );
      });
    }
    if (filters.teleconsultation !== undefined) {
      query = query.andWhere('teleconsultation', filters.teleconsultation);
    }

    return query.orderByRaw('RANDOM()');
  } catch (err) {
    console.error('Impossible de récupérer les psychologistes', err);
    throw new Error('Impossible de récupérer les psychologistes');
  }
};

const getByIds = async (ids: string[]): Promise<{ [key: string]: Psychologist }> => {
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
        const coordinates = await getAddressCoordinates(psy.address);
        psychologistsToInsert.push({
          ...psy,
          languages: addFrenchLanguageIfMissing(psy.languages),
          assignedUniversityId: dbUniversities.getAssignedUniversityId(psy, universities),
          ...(coordinates && {
            longitude: coordinates.longitude,
            latitude: coordinates.latitude,
            city: coordinates.city,
            postcode: coordinates.postcode,
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

      let coordinates: Coordinates;
      if (psyInDb.address !== psy.address) {
        coordinates = await getAddressCoordinates(psy.address);
      }

      return db(psychologistsTable)
        .where({ dossierNumber: psy.dossierNumber })
        .update({
          ...editablePsyFields({
            ...psy,
            ...(coordinates && {
              longitude: coordinates.longitude,
              latitude: coordinates.latitude,
              city: coordinates.city,
              postcode: coordinates.postcode,
            }),
          }),
          ...nonEditablePsyFields(psy),
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
  : Promise<{ count: number, archived: boolean, state: DossierState }[]> => db(psychologistsTable)
    .select('archived', 'state')
    .count('*')
    .groupBy('archived', 'state');

const countAcceptedByPersonalEmail = async ()
  : Promise<{ count: number, personalEmail: string, state: DossierState }[]> => db(psychologistsTable)
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
  isConventionSigned: boolean,
): Promise<number> => {
  const updated = await db(psychologistsTable)
    .where({
      dossierNumber: psychologistId,
    })
    .update({
      isConventionSigned,
      updatedAt: date.now(),
    });
  if (!updated) {
    throw new Error('No psychologist found for this id');
  }
  return updated;
};

const getConventionInfo = async (psychologistId: string)
  : Promise<{
    universityName: string,
    universityId: string,
    isConventionSigned: boolean
  }> => db.from(psychologistsTable)
    .select(
      `${'universities'}.name as universityName`,
      `${'universities'}.id as universityId`,
      `${psychologistsTable}.isConventionSigned`,
    )
    .innerJoin(
      'universities',
      `${psychologistsTable}.assignedUniversityId`,
      `${'universities'}.id`,
    )
    .where(`${psychologistsTable}.dossierNumber`, psychologistId)
    .first();

const deleteConventionInfo = async (email: string): Promise<number> => db
  .from(psychologistsTable)
  .update({
    isConventionSigned: null,
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

const inactive = async (
  token: string,
  reason: string,
): Promise<void> => {
  const psy = await db('inactive_token').where({ token }).first();
  await suspend(psy.id, new Date('9999-12-31'), reason);
};

const active = async (
  token: string,
): Promise<void> => {
  const psy = await db('inactive_token').where({ token }).first();
  await activate(psy.id);
  await db('inactive_token').update({ confirm: true }).where({ token });
};

const resetTutorial = async (email: string): Promise<number> => {
  try {
    return db(psychologistsTable)
      .where('personalEmail', email)
      .update({
        hasSeenTutorial: false,
      });
  } catch (err) {
    console.error('Erreur de modification du psychologue', err);
    throw new Error('Erreur de modification du psychologue');
  }
};

const seeTutorial = async (dossierNumber: string): Promise<number> => {
  try {
    return db(psychologistsTable)
      .where('dossierNumber', dossierNumber)
      .update({
        hasSeenTutorial: true,
      });
  } catch (err) {
    console.error('Erreur de modification du psychologue', err);
    throw new Error('Erreur de modification du psychologue');
  }
};

export default {
  getAllActiveByAvailability,
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
  inactive,
  active,
  seeTutorial,
  resetTutorial,
};
