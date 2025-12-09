import {
  appointmentsTable,
  patientsTable,
  psychologistsTable,
  dsApiCursorTable,
  psyLoginTokenTable,
  universitiesTable,
  suspensionReasonsTable,
  lastConnectionsTable,
  studentsNewsletterTable,
  studentsTable,
} from '../../db/tables';
import db from '../../db/db';

const dataCursor = async (): Promise<void> => { await db(dsApiCursorTable).del(); };

const dataToken = async (): Promise<void> => { await db(psyLoginTokenTable).del(); };

const appointments = async (): Promise<void> => { await db(appointmentsTable).del(); };

const patients = async (): Promise<void> => {
  await appointments();
  await db(patientsTable).del();
};

const studentsNewsletter = async (): Promise<void> => {
  await db(studentsNewsletterTable).del();
};

const psychologists = async ():Promise<void> => {
  await patients();
  await db(lastConnectionsTable).del();
  await db(suspensionReasonsTable).del();
  await db(psychologistsTable).del();
};

const students = async ():Promise<void> => {
  await db(studentsTable).del();
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
  students,
  studentsNewsletter,
};
