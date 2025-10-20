/* eslint-disable no-continue */
/* eslint-disable no-await-in-loop */
import date from '../utils/date';
import { psychologistsTable, suspensionReasonsTable, assignedUniversityTable } from './tables';
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
  // Utiliser la nouvelle table assigned_university au lieu de la colonne
  const trx = await db.transaction();
  
  try {
    // Fermer toute assignation active existante
    await trx(assignedUniversityTable)
      .where('psychologistId', psychologistId)
      .whereNull('unassignedAt')
      .update({
        unassignedAt: date.now(),
        updatedAt: date.now(),
      });

    // Créer la nouvelle assignation
    await trx(assignedUniversityTable)
      .insert({
        psychologistId,
        universityId: assignedUniversityId,
        assignedAt: date.now(),
        createdAt: date.now(),
      });

    await trx.commit();
    console.log(`Psy id ${psychologistId} assigned to university ${assignedUniversityId}`);
    
    return 1; // Retourner 1 pour indiquer le succès
  } catch (error) {
    await trx.rollback();
    console.error('Error assigning university:', error);
    throw new Error('Failed to assign university');
  }
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
        qb.whereRaw('unaccent("firstNames") ILIKE ?', [`%${filters.name}%`])
          .orWhereRaw('unaccent("lastName") ILIKE ?', [`%${filters.name}%`])
          .orWhereRaw('unaccent("useLastName") ILIKE ?', [`%${filters.name}%`])
          .orWhereRaw('unaccent("useFirstNames") ILIKE ?', [`%${filters.name}%`]);
      });
    }
    if (filters.address) {
      query = query.andWhere((qb) => {
        qb.whereRaw('unaccent(replace(address, \'-\', \' \')) ILIKE ?', [`%${filters.address}%`])
          .orWhereRaw('unaccent(replace("otherAddress", \'-\', \' \')) ILIKE ?', [`%${filters.address}%`])
          .orWhereRaw('unaccent(replace(departement, \'-\', \' \')) ILIKE ?', [`%${filters.address}%`])
          .orWhereRaw('unaccent(replace(region, \'-\', \' \')) ILIKE ?', [`%${filters.address}%`])
          .orWhereRaw('replace(postcode, \' \', \'\') ILIKE ?', [`%${filters.address}%`]);
      });
    }
    if (filters.language) {
      query = query.andWhereRaw('unaccent(languages) ILIKE ?', [`%${filters.language}%`]);
    }

    if (filters.speciality) {
      const specialityValue = `%${filters.speciality}%`;
      query = query.andWhere((qb) => {
        qb.whereRaw('unaccent(description) ILIKE ?', [specialityValue])
          .orWhereRaw('unaccent(diploma) ILIKE ?', [specialityValue])
        .orWhereRaw(
          `EXISTS (
            SELECT 1 FROM jsonb_array_elements_text(training::jsonb) AS elem 
            WHERE unaccent(elem) ILIKE ?
          )`,
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

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Perform a UPSERT with https://knexjs.org/#Builder-merge
 * @param {*} psy
 */
const upsertMany = async (psyList: Psychologist[]): Promise<void> => {
  console.log(`UPSERT of ${psyList.length} psychologists into PG....`);
  const updatedAt = date.now();
  const universities = await dbUniversities.getAll();
  const psychologists = await getByIds(psyList.map((psy) => psy.dossierNumber));
  const psychologistsToInsert = [];

  for (let index = 0; index < psyList.length; index++) {
    const psy = psyList[index];
    try {
      const psyInDb = psychologists[psy.dossierNumber];
      if (!psyInDb) {
        if (index > 0) await sleep(50);
        const coordinates = await getAddressCoordinates(psy.address);

        const psyToInsert = {
          ...psy,
          languages: addFrenchLanguageIfMissing(psy.languages),
          ...(coordinates && {
            longitude: coordinates.longitude,
            latitude: coordinates.latitude,
            city: coordinates.city,
            postcode: coordinates.postcode,
          }),
        };
        
        // Stocker l'assignation d'université pour plus tard
        const universityId = dbUniversities.getAssignedUniversityId(psy, universities);
        if (universityId) {
          (psyToInsert as any)._universityToAssign = universityId;
        }
        
        psychologistsToInsert.push(psyToInsert);
        continue;
      }

      if (psyInDb.selfModified) {
        await db(psychologistsTable)
          .where({ dossierNumber: psy.dossierNumber })
          .update({
            ...nonEditablePsyFields(psy),
            updatedAt,
          });
        continue;
      }

      let coordinates: Coordinates;
      if (psyInDb.address !== psy.address) {
        coordinates = await getAddressCoordinates(psy.address);
      }

      await db(psychologistsTable)
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
      console.error(`Error to insert ${psy.dossierNumber}`, err);
    }
  }

  if (psychologistsToInsert.length > 0) {
    try {
      // Séparer les données d'université des données de psychologue
      const psyData = psychologistsToInsert.map((psy) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { _universityToAssign, ...cleanPsy } = psy as any;
        return cleanPsy;
      });
      
      await db(psychologistsTable).insert(psyData);
      
      // Créer les assignations d'université après insertion
      const assignments = psychologistsToInsert
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((psy) => (psy as any)._universityToAssign)
        .map((psy) => ({
          psychologistId: psy.dossierNumber,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          universityId: (psy as any)._universityToAssign,
          assignedAt: date.now(),
          createdAt: date.now(),
        }));
      
      if (assignments.length > 0) {
        await db(assignedUniversityTable).insert(assignments);
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('Error to insert psychologists', err);
      throw err;
    }
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
      assignedUniversityTable,
      `${psychologistsTable}.dossierNumber`,
      `${assignedUniversityTable}.psychologistId`,
    )
    .innerJoin(
      'universities',
      `${assignedUniversityTable}.universityId`,
      `${'universities'}.id`,
    )
    .where(`${psychologistsTable}.dossierNumber`, psychologistId)
    .whereNull(`${assignedUniversityTable}.unassignedAt`) // Seulement l'assignation active
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

const getCurrentUniversity = async (psychologistId: string): Promise<string | null> => {
  try {
    const assignment = await db(assignedUniversityTable)
      .where('psychologistId', psychologistId)
      .whereNull('unassignedAt')
      .first();
    
    return assignment ? assignment.universityId : null;
  } catch (err) {
    console.error('Erreur de récupération de l\'université assignée', err);
    return null;
  }
};

export default {
  getAllActive,
  getAllActiveByAvailability,
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
  getCurrentUniversity,
};
