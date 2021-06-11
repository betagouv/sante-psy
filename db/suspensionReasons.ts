import { SuspensionReason } from '../types/SuspensionReason';
import knexConfig from '../knexfile';
import knex from 'knex';

const db = knex(knexConfig);

const getAllForPsychologist = async (psychologistId: string) : Promise<SuspensionReason[]> => db
    .select()
    .from('suspension_reasons')
    .where(
      { psychologistId },
    );

export default { getAllForPsychologist };
