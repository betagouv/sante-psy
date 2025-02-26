// eslint-disable-next-line import/no-unresolved
import { Registry } from 'knex/types/result';
import { DossierState } from '../types/DossierState';
import {
  appointmentsTable,
  patientsTable,
  psychologistsTable,
} from './tables';
import db from './db';

const getAvailablePsychologistCount = (): Promise<Registry[]> => {
  const now = new Date();
  const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());

  return db(psychologistsTable)
    .where({
      state: DossierState.accepte,
      archived: false,
    })
    .where((builder) => {
      builder.where('active', true)
        .orWhere((subBuilder) => {
          subBuilder
            .where('active', false)
            .where('inactiveUntil', '<=', threeMonthsFromNow.toISOString().split('T')[0]);
        });
    })
    .countDistinct('dossierNumber');
};

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
