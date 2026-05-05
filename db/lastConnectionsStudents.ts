import { lastConnectionsStudentsTable } from './tables';
import db from './db';

const upsert = async (studentId: string): Promise<number[]> =>
  db(lastConnectionsStudentsTable)
    .insert({
      student_id: studentId,
      at: new Date(),
    })
    .onConflict('student_id')
    .merge({
      at: new Date(),
    });

export default { upsert };
