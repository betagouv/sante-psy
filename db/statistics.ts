import knex from 'knex';
import { Registry } from 'knex/types/result';
import { DOSSIER_STATE } from '../utils/dossierState';
import { patientsTable, psychologistsTable, universitiesTable } from './tables';

const knexConfig = require('../knexfile');

const db = knex(knexConfig);

const getUniversityCount = (): Promise<Registry[]> => db(psychologistsTable)
    .innerJoin(universitiesTable, 'assignedUniversityId', 'id')
    .countDistinct('id');

const getActivePsychologistCount = (): Promise<Registry[]> => db(psychologistsTable)
    .where({
      state: DOSSIER_STATE.accepte,
      archived: false,
    })
    .countDistinct('dossierNumber');

const getPatientCount = () : Promise<Registry[]> => db(patientsTable)
    .where({ deleted: false })
    .countDistinct('id');

export { getUniversityCount, getActivePsychologistCount, getPatientCount };
