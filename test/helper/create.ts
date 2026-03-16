import { faker } from '@faker-js/faker';
import { DSPsychologist, Psychologist } from '../../types/Psychologist';
import { Patient } from '../../types/Patient';
import { Appointment } from '../../types/Appointment';
import uuid from '../../utils/uuid';
import dbPsychologists from '../../db/psychologists';
import dbUniversities from '../../db/universities';
import {
  appointmentsTable,
  psychologistsTable,
  studentsTable,
} from '../../db/tables';
import { DossierState } from '../../types/DossierState';
import db from '../../db/db';
import { University } from '../../types/University';
import { allGenders } from '../../types/Genders';
import { Student } from '../../types/Student';

faker.locale = 'fr';

const languages = [
  'allemand ; anglais ; français',
  'Anglais et français',
  'Anglais et Français',
  'Anglais, Francais',
  'Anglais /français',
  'Anglais ; Français',
  'Anglais français espagnol',
  'anglais français italien',
  'Anglais français italien',
  'ANGLAIS, FRANÇAIS, RUSSE , ROUMAIN',
  'Anglais, Langue des signes française',
  'anglais, portugais, français',
  'anglais, russe et français',
  'Arabe, français',
  'arabe, français et anglais',
  'Basque et français',
  'Bilangue Français et anglais',
  'Bilingue anglais français',
  'en cours de formation langue des signes, français',
  'espagnol et français',
  'Espagnol et français',
  'Espagnol, français',
  'Espagnol, Français',
  'ESPAGNOL - FRANçAIS',
  'fraçais, arabe, langue des signes française LSF',
  'Français, Anglais, Néerlandais',
  'Français, Anglais, Néérlandais - parfaitement trilingue',
  'Français, Anglais parlé, mais pas langue maternelle',
];

const getRandomInt = (): string => {
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

const getEmailFromNames = (firstNames, lastName): string => `${[firstNames, lastName].join(' ')
  .replaceAll(' ', '.')
  .toLowerCase()}@test.com`
  .normalize('NFKD')
  .replace(/[^\w.@-]/g, '');

const getAddress = (): {
  address: string,
  departement: string,
  region: string,
  longitude: number,
  latitude: number,
  city: string,
  postcode: string,
  otherAddress?: string,
  otherLongitude?: number,
  otherLatitude?: number,
  otherCity?: string,
  otherPostcode?: string,
} => {
  const rand = faker.datatype.number() % 5;
  switch (rand) {
    case 0:
      return {
        address: `${getRandomInt()} avenue de segur 75007 paris`,
        departement: '75 - Paris',
        region: 'Ile-de-France',
        longitude: 2.30888,
        latitude: 48.85057,
        city: 'paris',
        postcode: '75007',
      };
    case 1:
      return {
        address: `${getRandomInt()} cours de verdun, 33000, Bordeaux`,
        departement: '33 - Gironde',
        region: 'Nouvelle-Aquitaine',
        longitude: -0.57571,
        latitude: 44.84866,
        city: 'Bordeaux',
        postcode: '33000',
        otherAddress: `${getRandomInt()} cours de verdun, 33000, Bordeaux`,
        otherLongitude: -0.57581,
        otherLatitude: 44.84846,
        otherCity: 'Bordeaux',
        otherPostcode: '33000',
      };
    case 2:
      return {
        address: `${getRandomInt()} Boulevard Maréchal Foch 38100 Grenoble`,
        departement: '38 - Isère',
        region: 'Auvergne-Rhône-Alpes',
        longitude: 5.72005,
        latitude: 45.17954,
        city: 'Grenoble',
        postcode: '38100',
        otherAddress: `${getRandomInt()} cours de verdun, 33000, Bordeaux`,
        otherLongitude: -0.57581,
        otherLatitude: 44.84846,
        otherCity: 'Bordeaux',
        otherPostcode: '33000',
      };
    default:
      return {
        address: `${faker.address.streetAddress()} ${faker.address.zipCode('#####')} ${faker.address.city()}`,
        departement: '14 - Calvados',
        region: 'Normandie',
        longitude: -0.07308,
        latitude: 49.126301,
        city: null,
        postcode: null,
      };
  }
};

// faker can give address with accent wich are not considered as valid...
const getFakeAddress = (): string => {
  let website = '';
  const isWebsite = new RegExp(
    '^(https?:\\/\\/)?' // protocol
    + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
    + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
    + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
    + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
    + '(\\#[-a-z\\d_]*)?$',
    'i',
  ); // fragment locator
  while (!isWebsite.test(website)) {
    website = faker.internet.domainName() + faker.internet.domainSuffix();
  }

  return website;
};

const getBillingAddress = (): string | null => {
  const shouldHaveBillingAddress = Math.random() < 0.1;

  // eslint-disable-next-line max-len
  return shouldHaveBillingAddress ? `Service facturier - ${faker.address.streetAddress()} ${faker.address.zipCode('#####')} ${faker.address.city()}`
    : null;
};

const getOneUniversity = (name: string): University => ({
  name,
  id: uuid.generateFromString(`university-${name}`),
  emailUniversity: `${faker.internet.userName()}@beta.gouv.fr ; ${faker.internet.userName()}@beta.gouv.fr`,
  emailSSU: `${faker.internet.userName()}@beta.gouv.fr ; ${faker.internet.userName()}@beta.gouv.fr`,
  siret: faker.helpers.replaceSymbols('##############'),
  address: faker.address.streetAddress(),
  postal_code: faker.address.zipCode('#####'),
  city: faker.address.city(),
  billingAddress: getBillingAddress(),
  billingEmail: `${faker.internet.userName()}@beta.gouv.fr ; ${faker.internet.userName()}@beta.gouv.fr`,
});

const getOnePsy = (psychologist: Partial<Psychologist> = {}): Psychologist => {
  const dossierNumber = uuid.generateFromString(
    `psychologist-${psychologist.personalEmail || 'loginemail@beta.gouv.fr'}`,
  );

  const firstNames = getFirstNames();
  const lastName = faker.name.lastName();
  const email = getEmailFromNames(firstNames, lastName);
  return {
    dossierNumber,
    title: 'Mme',
    firstNames,
    lastName,
    archived: false,
    state: DossierState.accepte,
    adeli: `${getRandomInt()}829302942`,
    diploma: 'Psychologie clinique de la santé',
    diplomaYear: '2020',
    phone: faker.phone.number('0# ## ## ## ##'),
    email,
    personalEmail: 'loginemail@beta.gouv.fr',
    website: getFakeAddress(),
    appointmentLink: getFakeAddress(),
    teleconsultation: faker.datatype.boolean(),
    description: faker.lorem.paragraphs(2),
    // eslint-disable-next-line max-len
    training: '["Connaissance et pratique des outils diagnostic psychologique","Connaissance des troubles psychopathologiques du jeune adulte : dépressions","risques suicidaires","addictions","comportements à risque","troubles alimentaires","décompensation schizophrénique","psychoses émergeantes ainsi qu’une pratique de leur repérage","Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)"]',
    languages: faker.helpers.arrayElement(languages),
    isConventionSigned: false,
    createdAt: new Date(),
    active: true,
    acceptationDate: null,
    hasSeenTutorial: true,
    ...getAddress(),
    ...psychologist,
  };
};

const insertOnePsy = async (psychologist: Partial<Psychologist> = {}, withUniversity = true): Promise<Psychologist> => {
  let universityId = null;
  if (withUniversity) {
    const university = getOneUniversity(faker.company.name());
    await dbUniversities.upsertMany([university]);
    universityId = university.id;
  }

  const psy = getOnePsy({
    ...psychologist,
    assignedUniversityId: universityId,
  });
  await dbPsychologists.upsertMany([psy]);

  // Hack to force createdAt update
  if (psychologist.createdAt) {
    await db(psychologistsTable)
      .where('dossierNumber', psy.dossierNumber)
      .update({ createdAt: psychologist.createdAt });
  }

  return psy;
};

const getOneInactivePsy = (inactiveUntil: Date = new Date()): Psychologist => getOnePsy({
  personalEmail: `inactive@${inactiveUntil}.fr`,
  inactiveUntil,
  active: !inactiveUntil,
});

const getOnePsyDS = (
  champValue = faker.datatype.string(),
  champId = faker.datatype.string(),
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  title = 'Mme',
): DSPsychologist => ({
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
  traitements: [],
  champs: [
    {
      id: champId,
      stringValue: champValue,
    },
  ],
  demandeur: {
    nom: lastName,
    prenom: firstName,
    civilite: title,
  },
});

const getOnePatient = (index: number, patient: Partial<Patient> & { psychologistId: string }): Patient => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = getEmailFromNames(firstName, lastName);

  return {
    id: uuid.generateFromString(`patient-${patient.psychologistId}-${index}`),
    firstNames: firstName,
    lastName,
    INE: faker.phone.number('###########'),
    isINESvalid: false,
    email,
    institutionName: `${getRandomInt()} university`,
    isStudentStatusVerified: true,
    doctorName: faker.name.lastName(),
    dateOfBirth: faker.date.past(),
    gender: faker.helpers.arrayElement(allGenders),
    ...patient,
  };
};

const getOneIncompletePatient = (index: number, patient: Partial<Patient> & { psychologistId: string }): Patient => ({
  id: uuid.generateFromString(`patient-${patient.psychologistId}-${index}`),
  firstNames: faker.name.firstName(),
  lastName: faker.name.lastName(),
  gender: '',
  INE: '',
  email: '',
  isINESvalid: false,
  ...patient,
});

const getOneAppointment = (
  appointment: Partial<Appointment> & {
    patientId: string;
    psychologistId: string;
  },
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
  appointment: Partial<Appointment> & {
    patientId: string;
    psychologistId: string;
  },
): Promise<Appointment> => {
  const result = getOneAppointment(appointment);
  await db(appointmentsTable).insert(result);
  return result;
};

const getOneStudent = (student: Partial<Student> = {}): Student => {
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  const email = getEmailFromNames(firstName, lastName);

  return {
    id: uuid.generateRandom(),
    firstNames: firstName,
    lastName,
    email,
    dateOfBirth: faker.date.past(),
    ine: faker.phone.number('###########'),
    createdAt: new Date(),
    ...student,
  };
};

const insertOneStudent = async (student: Partial<Student> = {}): Promise<Student> => {
  const stud = getOneStudent(student);
  await db(studentsTable).insert(stud);
  return stud;
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
  getOneStudent,
  insertOneStudent,
};
