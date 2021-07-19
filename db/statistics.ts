import knex from 'knex';
import { Registry } from 'knex/types/result';
import { DossierState } from '../types/DemarcheSimplifiee';
import {
  appointmentsTable,
  patientsTable,
  psychologistsTable,
} from './tables';

const knexConfig = require('../knexfile');

const db = knex(knexConfig);

const getUniversityCount = (): Promise<Registry[]> => db(psychologistsTable)
    .countDistinct('assignedUniversityId');

const getActivePsychologistCount = (): Promise<Registry[]> => db(psychologistsTable)
    .where({
      state: DossierState.accepte,
      archived: false,
    })
    .countDistinct('dossierNumber');

const getPatientCount = () : Promise<Registry[]> => db(patientsTable)
    .where({ deleted: false })
    .countDistinct('id');

const getAppointmentCount = () : Promise<Registry[]> => db(appointmentsTable)
    .where({ deleted: false })
    .countDistinct('id');

export {
  getUniversityCount,
  getAppointmentCount,
  getActivePsychologistCount,
  getPatientCount,
};
