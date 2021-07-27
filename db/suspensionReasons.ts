import knex from 'knex';

import { SuspensionReason } from '../types/SuspensionReason';
import { suspensionReasonsTable } from './tables';

const knexConfig = require('../knexfile');

const db = knex(knexConfig);

const getByPsychologist = async (psychologistId: string) : Promise<SuspensionReason[]> => db
    .select()
    .from(suspensionReasonsTable)
    .where(
      { psychologistId },
    );

export default { getByPsychologist };
