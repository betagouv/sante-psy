// eslint-disable-next-line import/no-unresolved
import { Registry } from 'knex/types/result';
import { DossierState } from '../types/DossierState';
import {
  appointmentsTable,
  patientsTable,
  psychologistsTable,
} from './tables';
import db from './db';

const now = new Date();
const threeMonthsFromNow = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
const threeMonthsFromNowDate = threeMonthsFromNow.toISOString().split('T')[0];

const getPsychologistCount = (additionalCriteria = {}): Promise<Registry[]> => db(psychologistsTable)
    .where({
      state: DossierState.accepte,
      archived: false,
      ...additionalCriteria,
    })
    .where((builder) => {
      builder.where('active', true)
        .orWhere((subBuilder) => {
          subBuilder
            .where('active', false)
            .where('inactiveUntil', '<=', threeMonthsFromNowDate);
        });
    })
    .count('dossierNumber');

const getAvailablePsychologistCount = (): Promise<Registry[]> => getPsychologistCount();

const getTeleconsultPsyCount = (): Promise<Registry[]> => getPsychologistCount({ teleconsultation: true });

const getPatientCount = () : Promise<Registry[]> => db(patientsTable)
    .where({ deleted: false })
    .count('id');

const getAppointmentCount = () : Promise<Registry[]> => db(appointmentsTable)
    .where({ deleted: false })
    .count('id');

export {
  getAppointmentCount,
  getAvailablePsychologistCount,
  getPatientCount,
  getTeleconsultPsyCount,
};
