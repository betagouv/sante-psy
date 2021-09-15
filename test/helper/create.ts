import faker from 'faker';
import { DSPsychologist, Psychologist } from '../../types/Psychologist';
import { Patient } from '../../types/Patient';
import { Appointment } from '../../types/Appointment';
import uuid from '../../utils/uuid';
import dbPsychologists from '../../db/psychologists';
import dbUniversities from '../../db/universities';
import {
  appointmentsTable,
} from '../../db/tables';
import { DossierState } from '../../types/DossierState';
import db from '../../db/db';
import { University } from '../../types/University';

faker.locale = 'fr';

const getRandomInt = () : string => {
  const ourRandom = faker.datatype.number({ min: 1, max: 99 });
  if (ourRandom < 10) {
    return `0${ourRandom.toString()}`;
  }
  return ourRandom.toString();
};

const getFirstNames = (): string => {
  const rand = faker.datatype.number();
  let firstNames = faker.name.firstName();
  if (rand % 2 === 0) {
    firstNames += ` ${faker.name.firstName()}`;
  }
  if (rand % 10 === 0) {
    firstNames += ` ${faker.name.firstName()}`;
  }
  return firstNames;
};

const getAddress = (): {address: string, departement: string, region: string} => {
  const rand = faker.datatype.number() % 5;
  switch (rand) {
  case 0:
    return {
      address: `${getRandomInt()} avenue de segur 75007 paris`,
      departement: '75 - Paris',
      region: 'Ile-de-France',
    };
  case 1:
    return {
      address: `${getRandomInt()} cours de verdun, 33000, Bordeaux`,
      departement: '33 - Gironde',
      region: 'Nouvelle-Aquitaine',
    };
  case 2:
    return {
      address: `${getRandomInt()} Boulevard Maréchal Foch 38100 Grenoble`,
      departement: '38 - Isère',
      region: 'Auvergne-Rhône-Alpes',
    };
  default:
    return {
      address: `${faker.address.streetAddress()} ${faker.address.zipCode('#####')} ${faker.address.city()}`,
      departement: '14 - Calvados',
      region: 'Normandie',
    };
  }
};

const getOnePsy = (
  personalEmail = 'loginemail@beta.gouv.fr',
  state = DossierState.accepte,
  archived = false,
  uniId: string = null,
  inactiveUntil: Date | undefined = undefined,
): Psychologist => {
  const dossierNumber = uuid.generateFromString(`psychologist-${personalEmail}`);
  return {
    dossierNumber,
    firstNames: getFirstNames(),
    lastName: faker.name.lastName(),
    archived,
    state,
    adeli: `${getRandomInt()}829302942`,
    ...getAddress(),
    diploma: 'Psychologie clinique de la santé',
    phone: faker.phone.phoneNumber('0# ## ## ## ##'),
    email: faker.internet.exampleEmail(),
    personalEmail,
    website: faker.internet.domainName() + faker.internet.domainSuffix(),
    teleconsultation: faker.datatype.boolean(),
    description: faker.lorem.paragraphs(2),
    // eslint-disable-next-line max-len
    training: '["Connaissance et pratique des outils diagnostic psychologique","Connaissance des troubles psychopathologiques du jeune adulte : dépressions","risques suicidaires","addictions","comportements à risque","troubles alimentaires","décompensation schizophrénique","psychoses émergeantes ainsi qu’une pratique de leur repérage","Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)"]',
    assignedUniversityId: uniId,
    languages: 'Français, Anglais, et Espagnol',
    active: !inactiveUntil,
    inactiveUntil,
    createdAt: new Date(),
    longitude: null,
    latitude: null,
  };
};

const getOneInactivePsy = (inactiveUntil?: Date): Psychologist => getOnePsy(
  `inactive@${inactiveUntil}.fr`,
  DossierState.accepte,
  false,
  null,
  inactiveUntil,
);

const getOnePsyDS = (
  champValue = faker.datatype.string(),
  champId = faker.datatype.string(),
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
) : DSPsychologist => ({
  id: faker.datatype.string(),
  state: DossierState.accepte,
  archived: false,
  usager: {
    email: faker.internet.exampleEmail(),
  },
  number: faker.datatype.number(),
  groupeInstructeur: {
    label: faker.lorem.word(),
  },
  messages: [],
  annotations: [],
  champs: [{
    id: champId,
    stringValue: champValue,
  }],
  demandeur: {
    nom: lastName,
    prenom: firstName,
  },
});

const getOnePatient = (
  index: number,
  psychologistId: string,
  doctorName = undefined,
  useDateOfBirth = true,
): Patient => {
  let dateOfBirth = null;
  if (useDateOfBirth) {
    dateOfBirth = faker.date.past();
  }
  return {
    id: uuid.generateFromString(`patient-${psychologistId}-${index}`),
    firstNames: faker.name.firstName(),
    lastName: faker.name.lastName(),
    INE: faker.phone.phoneNumber('###########'),
    institutionName: `${getRandomInt()} university`,
    isStudentStatusVerified: true,
    hasPrescription: true,
    psychologistId,
    doctorName: doctorName === undefined ? faker.name.lastName() : doctorName,
    doctorAddress: faker.address.streetAddress(),
    dateOfBirth,
  };
};

const getOneIncompletePatient = (index: number, psychologistId: string): Patient => ({
  id: uuid.generateFromString(`patient-${psychologistId}-${index}`),
  firstNames: faker.name.firstName(),
  lastName: faker.name.lastName(),
  psychologistId,
});

const getOneAppointment = (
  patientId: string, psychologistId: string, month = 3, day = 10, deleted = false,
): Appointment => {
  const myDate = new Date(2021, month, day).toISOString();
  return {
    id: uuid.generateRandom(),
    psychologistId,
    appointmentDate: myDate,
    patientId,
    deleted,
  };
};

const insertOneAppointment = async (
  patientId: string, psychologistId: string, month = 3, day = 10, deleted = false,
): Promise<Appointment> => {
  const appointment = getOneAppointment(patientId, psychologistId, month, day, deleted);
  await db(appointmentsTable).insert(appointment);
  return appointment;
};

const getOneUniversity = (name: string) : University => ({
  name,
  id: uuid.generateFromString(`university-${name}`),
  emailUniversity: `${faker.internet.userName()}@beta.gouv.fr ; ${faker.internet.userName()}@beta.gouv.fr`,
  emailSSU: `${faker.internet.userName()}@beta.gouv.fr ; ${faker.internet.userName()}@beta.gouv.fr`,
  siret: faker.helpers.replaceSymbols('##############'),
  address: faker.address.streetAddress(),
  postal_code: faker.address.zipCode('#####'),
  city: faker.address.city(),
});

const insertOnePsy = async (
  personalEmail = 'loginemail@beta.gouv.fr',
  state = DossierState.accepte,
  archived = false,
  inactiveUntil = undefined,
  withUniversity = true,
): Promise<Psychologist> => {
  let universityId = null;
  if (withUniversity) {
    const university = getOneUniversity(faker.company.companyName());
    await dbUniversities.upsertMany([university]);
    universityId = university.id;
  }

  const psy = getOnePsy(personalEmail, state, archived, universityId, inactiveUntil);
  await dbPsychologists.upsertMany([psy]);
  return psy;
};

export default {
  getRandomInt,
  getOneAppointment,
  getOneIncompletePatient,
  getOnePatient,
  getOneUniversity,
  getOnePsy,
  getOneInactivePsy,
  getOnePsyDS,
  insertOnePsy,
  insertOneAppointment,
};
