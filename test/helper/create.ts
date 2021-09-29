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

const getAddress = (): {
    address: string,
    departement: string,
    region: string,
    longitude: number,
    latitude: number
  } => {
  const rand = faker.datatype.number() % 5;
  switch (rand) {
  case 0:
    return {
      address: `${getRandomInt()} avenue de segur 75007 paris`,
      departement: '75 - Paris',
      region: 'Ile-de-France',
      longitude: 2.308880,
      latitude: 48.850570,
    };
  case 1:
    return {
      address: `${getRandomInt()} cours de verdun, 33000, Bordeaux`,
      departement: '33 - Gironde',
      region: 'Nouvelle-Aquitaine',
      longitude: -0.575710,
      latitude: 44.848660,
    };
  case 2:
    return {
      address: `${getRandomInt()} Boulevard Maréchal Foch 38100 Grenoble`,
      departement: '38 - Isère',
      region: 'Auvergne-Rhône-Alpes',
      longitude: 5.720050,
      latitude: 45.179540,
    };
  default:
    return {
      address: `${faker.address.streetAddress()} ${faker.address.zipCode('#####')} ${faker.address.city()}`,
      departement: '14 - Calvados',
      region: 'Normandie',
      longitude: -0.073080,
      latitude: 49.126301,
    };
  }
};

// faker can give address with accent wich are not considered as valid...
const getFakeAddress = (): string => {
  let website = '';
  const isWebsite = new RegExp('^(https?:\\/\\/)?' // protocol
  + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
  + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
  + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
  + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
  + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
  while (!isWebsite.test(website)) {
    website = faker.internet.domainName() + faker.internet.domainSuffix();
  }

  return website;
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

const getOnePsy = (
  psychologist: Partial<Psychologist> = {},
): Psychologist => {
  const dossierNumber = uuid.generateFromString(
    `psychologist-${psychologist.personalEmail || 'loginemail@beta.gouv.fr'}`,
  );

  return {
    dossierNumber,
    firstNames: getFirstNames(),
    lastName: faker.name.lastName(),
    archived: false,
    state: DossierState.accepte,
    adeli: `${getRandomInt()}829302942`,
    diploma: 'Psychologie clinique de la santé',
    phone: faker.phone.phoneNumber('0# ## ## ## ##'),
    email: faker.internet.exampleEmail(),
    personalEmail: 'loginemail@beta.gouv.fr',
    website: getFakeAddress(),
    teleconsultation: faker.datatype.boolean(),
    description: faker.lorem.paragraphs(2),
    // eslint-disable-next-line max-len
    training: '["Connaissance et pratique des outils diagnostic psychologique","Connaissance des troubles psychopathologiques du jeune adulte : dépressions","risques suicidaires","addictions","comportements à risque","troubles alimentaires","décompensation schizophrénique","psychoses émergeantes ainsi qu’une pratique de leur repérage","Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)"]',
    languages: 'Français, Anglais, et Espagnol',
    isConventionSigned: false,
    createdAt: new Date(),
    active: true,
    ...getAddress(),
    ...psychologist,
  };
};

const insertOnePsy = async (
  psychologist: Partial<Psychologist> = {},
  withUniversity = true,
): Promise<Psychologist> => {
  let universityId = null;
  if (withUniversity) {
    const university = getOneUniversity(faker.company.companyName());
    await dbUniversities.upsertMany([university]);
    universityId = university.id;
  }

  const psy = getOnePsy({ ...psychologist, assignedUniversityId: universityId });
  await dbPsychologists.upsertMany([psy]);
  return psy;
};

const getOneInactivePsy = (inactiveUntil: Date = new Date()): Psychologist => getOnePsy(
  {
    personalEmail: `inactive@${inactiveUntil}.fr`,
    inactiveUntil,
    active: !inactiveUntil,
  },
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
  patient: Partial<Patient> & {psychologistId: string},
): Patient => ({
  id: uuid.generateFromString(`patient-${patient.psychologistId}-${index}`),
  firstNames: faker.name.firstName(),
  lastName: faker.name.lastName(),
  INE: faker.phone.phoneNumber('###########'),
  institutionName: `${getRandomInt()} university`,
  isStudentStatusVerified: true,
  hasPrescription: true,
  doctorName: faker.name.lastName(),
  doctorAddress: faker.address.streetAddress(),
  dateOfBirth: faker.date.past(11, '2010-09-14'),
  ...patient,
});

const getOneIncompletePatient = (
  index: number,
  patient: Partial<Patient> & {psychologistId: string},
): Patient => ({
  id: uuid.generateFromString(`patient-${patient.psychologistId}-${index}`),
  firstNames: faker.name.firstName(),
  lastName: faker.name.lastName(),
  ...patient,
});

const getOneAppointment = (
  appointment: Partial<Appointment> & {patientId: string, psychologistId: string},
): Appointment => {
  const myDate = new Date(2021, 3, 10).toISOString();
  return {
    id: uuid.generateRandom(),
    appointmentDate: myDate,
    deleted: false,
    ...appointment,
  };
};

const insertOneAppointment = async (
  appointment: Partial<Appointment> & {patientId: string, psychologistId: string},
): Promise<Appointment> => {
  const result = getOneAppointment(appointment);
  await db(appointmentsTable).insert(result);
  return result;
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
