// eslint-disable-next-line import/no-unresolved
import { Registry } from 'knex/types/result';
import { DossierState } from '../types/DossierState';
import {
  appointmentsTable,
  patientsTable,
  psychologistsTable,
} from './tables';
import db from './db';

const getAvailablePsychologistCount = (): Promise<Registry[]> => db(psychologistsTable)
    .where({
      state: DossierState.accepte,
      archived: false,
      active: true,
    })
    .countDistinct('dossierNumber');

const getPatientCount = () : Promise<Registry[]> => db(patientsTable)
    .where({ deleted: false })
    .countDistinct('id');

const getAppointmentCount = () : Promise<Registry[]> => db(appointmentsTable)
    .where({ deleted: false })
    .countDistinct('id');

export {
  getAppointmentCount,
  getAvailablePsychologistCount,
  getPatientCount,
};
