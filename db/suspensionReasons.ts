import { SuspensionReason } from '../types/SuspensionReason';
import { suspensionReasonsTable } from './tables';
import db from './db';

const getByPsychologist = async (psychologistId: string) : Promise<SuspensionReason[]> => db
    .select()
    .from(suspensionReasonsTable)
    .where(
      { psychologistId },
    );

export default { getByPsychologist };
