import {
  appointmentsTable,
  patientsTable,
  psychologistsTable,
  dsApiCursorTable,
  loginTokenTable,
  universitiesTable,
  suspensionReasonsTable,
  lastConnectionsTable,
} from '../../db/tables';
import db from '../../db/db';

const dataCursor = async (): Promise<void> => { await db(dsApiCursorTable).del(); };

const dataToken = async (): Promise<void> => { await db(loginTokenTable).del(); };

const appointments = async (): Promise<void> => { await db(appointmentsTable).del(); };

const patients = async (): Promise<void> => {
  await appointments();
  await db(patientsTable).del();
};

const psychologists = async ():Promise<void> => {
  await patients();
  await db(lastConnectionsTable).del();
  await db(suspensionReasonsTable).del();
  await db(psychologistsTable).del();
};

const universities = async ():Promise<void> => {
  await psychologists();
  await db(universitiesTable).del();
};

export default {
  dataCursor,
  dataToken,
  patients,
  appointments,
  psychologists,
  universities,
};
