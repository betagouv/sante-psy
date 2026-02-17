import { Knex } from 'knex';
import { seed as cleanSeed } from '../seed/00-clean';
import { seed as universitiesSeed } from '../seed/01-universities';
import { seed as psychologistsSeed } from '../seed/02-psychologists';
import { seed as patientsSeed } from '../seed/03-patients';
import { seed as appointmentsSeed } from '../seed/04-appointments';
import { seed as studentsSeed } from '../seed/05-students';

export default async (knex: Knex, year?: number, fixedValues = false): Promise<void> => {
  await cleanSeed(knex);
  await universitiesSeed(knex);
  await psychologistsSeed(knex);
  await patientsSeed(knex, fixedValues);
  await appointmentsSeed(knex, year, fixedValues);
  await studentsSeed(knex);
};
