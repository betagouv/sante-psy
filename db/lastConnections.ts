import knex from 'knex';

import { LastConnection } from '../types/LastConnection';
import { lastConnectionsTable } from './tables';

const knexConfig = require('../knexfile');

const db = knex(knexConfig);

const upsert = async (psychologistId: string) : Promise<LastConnection[]> => db(lastConnectionsTable)
    .insert({
      psychologistId,
      at: new Date(),
    })
    .onConflict('psychologistId')
    .merge({
      at: new Date(),
    });

export default { upsert };
