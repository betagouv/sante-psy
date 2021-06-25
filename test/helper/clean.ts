import { Psychologist } from '../../types/Psychologist';
import { Patient } from '../../types/Patient';
import { Appointment } from '../../types/Appointment';
import knex from 'knex';
import uuid from '../../utils/uuid';
import {
  appointmentsTable,
  patientsTable,
  psychologistsTable,
  dsApiCursorTable,
  loginTokenTable,
  universitiesTable,
  suspensionReasonsTable,
} from '../../db/tables';

const knexConfig = require('../../knexfile');

const dbPsychologists = require('../../db/psychologists');
const dbUniversities = require('../../db/universities');

const db = knex(knexConfig);

const getRandomInt = () : string => {
  const min = Math.ceil(1);
  const max = Math.floor(99);
  const ourRandom = Math.floor(Math.random() * (max - min) + min);
  if (ourRandom < 10) {
    return `0${ourRandom.toString()}`;
  }
  return ourRandom.toString();
};

const getOnePsy = (
  personalEmail = 'loginemail@beta.gouv.fr',
  state = 'accepte',
  archived = false,
  uniId: string = null,
  inactiveUntil: string | undefined = undefined,
): Psychologist => {
  const dossierNumber = uuid.generateUuidFromString(`psychologist-${personalEmail}`);
  return {
    dossierNumber,
    firstNames: `${getRandomInt()}First`,
    lastName: `${getRandomInt()}Last`,
    archived,
    state,
    adeli: `${getRandomInt()}829302942`,
    address: `${getRandomInt()} SOLA 66110 MONTBOLO`,
    diploma: 'Psychologie clinique de la santé',
    phone: '0468396600',
    email: `${getRandomInt()}@beta.gouv.fr`,
    personalEmail,
    website: `${getRandomInt()}beta.gouv.fr`,
    teleconsultation: Math.random() < 0.5,
    description: 'description',
    // eslint-disable-next-line max-len
    training: '["Connaissance et pratique des outils diagnostic psychologique","Connaissance des troubles psychopathologiques du jeune adulte : dépressions","risques suicidaires","addictions","comportements à risque","troubles alimentaires","décompensation schizophrénique","psychoses émergeantes ainsi qu’une pratique de leur repérage","Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)"]',
    departement: '14 - Calvados',
    university: `${getRandomInt()} Université`,
    assignedUniversityId: uniId,
    region: 'Normandie',
    languages: 'Français ,Anglais, et Espagnol',
    active: !inactiveUntil,
    inactiveUntil,
  };
};

const getOneInactivePsy = (inactiveUntil: string): Psychologist => getOnePsy(
  `inactil@${inactiveUntil}.fr`,
  'accepte',
  false,
  null,
  inactiveUntil,
);

const getOnePatient = (
  index: number,
  psychologistId: string,
  doctorName = 'doctorName',
  useDateOfBirth = true,
): Patient => {
  let dateOfBirth = null;
  if (useDateOfBirth) {
    dateOfBirth = new Date(1980, 1, 10).toISOString();
  }
  return {
    id: uuid.generateUuidFromString(`patient-${psychologistId}-${index}`),
    firstNames: `${getRandomInt()}First`,
    lastName: `${getRandomInt()}Last`,
    INE: '11111111111',
    institutionName: `${getRandomInt()} university`,
    isStudentStatusVerified: true,
    hasPrescription: true,
    psychologistId,
    doctorName,
    doctorAddress: 'doctorAddress',
    dateOfBirth,
  };
};

const getOneAppointment = (
  patientId: string, psychologistId: string, month = 3, day = 10, deleted = false,
): Appointment => {
  const myDate = new Date(2021, month, day).toISOString();
  return {
    id: uuid.randomUuid(),
    psychologistId,
    appointmentDate: myDate,
    patientId,
    deleted,
  };
};

const insertOnePsy = async (
  personalEmail = 'loginemail@beta.gouv.fr',
  state = 'accepte',
  archived = false,
  inactiveUntil = undefined,
): Promise<Psychologist> => {
  const universityId = uuid.randomUuid();
  const psy = getOnePsy(personalEmail, state, archived, universityId, inactiveUntil);
  const id = getRandomInt();
  await dbUniversities.saveUniversities([{
    id: universityId,
    name: `University ${id}`,
    emailSSU: `ssu${id}@spe.fr`,
    emailUniversity: `university${id}@spe.fr`,
  }]);
  await dbPsychologists.savePsychologistInPG([psy]);
  return psy;
};

const cleanDataCursor = async (): Promise<void> => { await db(dsApiCursorTable).del(); };

const cleanDataToken = async (): Promise<void> => { await db(loginTokenTable).del(); };

const cleanAllAppointments = async (): Promise<void> => { await db(appointmentsTable).del(); };

const cleanAllPatients = async (): Promise<void> => {
  await cleanAllAppointments();
  await db(patientsTable).del();
};

const cleanAllPsychologists = async ():Promise<void> => {
  await cleanAllPatients();
  await db(suspensionReasonsTable).del();
  await db(psychologistsTable).del();
};

const cleanAllUniversities = async ():Promise<void> => {
  await cleanAllPsychologists();
  await db(universitiesTable).del();
};

export default {
  getRandomInt,
  getOneAppointment,
  getOnePatient,
  getOnePsy,
  insertOnePsy,
  getOneInactivePsy,
  cleanDataCursor,
  cleanDataToken,
  cleanAllPatients,
  cleanAllAppointments,
  cleanAllPsychologists,
  cleanAllUniversities,
};
