import { SuspensionReason } from '../types/SuspensionReason';
import knexConfig from '../knexfile';
import knex from 'knex';

const db = knex(knexConfig);

const getForPsychologist = async (psychologistId: string) : Promise<SuspensionReason[]> => db
    .select()
    // TODO: use the proper file for table name
    .from('suspension_reasons')
    .where(
      { psychologistId },
    );

export default { getForPsychologist };
