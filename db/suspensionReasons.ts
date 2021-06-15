import knex from 'knex';

import { SuspensionReason } from '../types/SuspensionReason';
import knexConfig from '../knexfile';
import { suspensionReasonsTable } from './tables';

const db = knex(knexConfig);

const getForPsychologist = async (psychologistId: string) : Promise<SuspensionReason[]> => db
    .select()
    .from(suspensionReasonsTable)
    .where(
      { psychologistId },
    );

export default { getForPsychologist };
