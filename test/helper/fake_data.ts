import { Knex } from 'knex';
import { seed as cleanSeed } from '../seed/00-clean';
import { seed as universitiesSeed } from '../seed/01-universities';
import { seed as psychologistsSeed } from '../seed/02-psychologists';
import { seed as patientsSeed } from '../seed/03-patients';
import { seed as appointmentsSeed } from '../seed/04-appointments';

export default async (knex: Knex, fixValue = false): Promise<void> => {
  await cleanSeed(knex);
  await universitiesSeed(knex);
  await psychologistsSeed(knex);
  await patientsSeed(knex, fixValue);
  await appointmentsSeed(knex, fixValue);
};
