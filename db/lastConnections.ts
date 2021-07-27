import { LastConnection } from '../types/LastConnection';
import { lastConnectionsTable } from './tables';
import db from './db';

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
