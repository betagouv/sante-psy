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
import geo from '../../utils/geo';

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

const knownCoords = [
  [-1.68186449, 48.11197912], // rennes
  [2.333333, 48.866667], // paris
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

type AddressElements = {
  streetAddress: string;
  city: string;
  postcode: string;
  longitude: number;
  latitude: number;
}
const getRandomAddressElements = (): AddressElements => {
  const streetAddress = faker.address.streetAddress();
  const city = faker.address.city();
  const postcode = faker.address.zipCode();
  const [longitude, latitude] = faker.helpers.arrayElement(knownCoords);
  return {
    streetAddress,
    city,
    postcode,
    longitude,
    latitude,
  };
};
type Address = {
  address: string;
  departement: string;
  region: string;
  city: string;
  postcode: string;
  longitude: number;
  latitude: number;
  otherAddress?: string;
  otherLongitude?: number;
  otherLatitude?: number;
  otherCity?: string;
  otherPostcode?: string;
};

const getAddress = (): Address => {
  const {
    streetAddress, city, postcode, longitude, latitude,
  } = getRandomAddressElements();

  const [departement, region] = faker.helpers.arrayElement(Object.entries(geo.departementToRegion));
  let ret: Address = {
    address: `${streetAddress} ${postcode} ${city}`,
    departement,
    region,
    city,
    postcode,
    longitude,
    latitude,
  };
  const rand = faker.datatype.number() % 5;
  if (rand === 0) {
    const {
      streetAddress: otherStreetAddress,
      city: otherCity,
      postcode: otherPostcode,
      longitude: otherLongitude,
      latitude: otherLatitude,
    } = getRandomAddressElements();
    ret = {
      ...ret,
      otherAddress: `${otherStreetAddress} ${otherPostcode} ${otherCity}`,
      otherLongitude,
      otherLatitude,
      otherCity,
      otherPostcode,

    };
  }
  return ret;
};

// faker can give address with accent wich are not considered as valid...
const getFakeAddress = (): string => {
  let website = '';
  const isWebsite = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/i;

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

const createUniversity = async (): Promise<University> => {
  const university = getOneUniversity(faker.company.name());
  await dbUniversities.upsertMany([university]);
  return university;
};

const getOnePsy = (psychologist: Partial<Psychologist> = {}): Psychologist => {
  const firstNames = getFirstNames();
  const lastName = faker.name.lastName();
  const email = getEmailFromNames(firstNames, lastName);

  const dossierNumber = uuid.generateFromString(
    `psychologist-${psychologist.personalEmail || email}`,
  );
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
    personalEmail: email,
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
  createUniversity,
  getRandomInt,
  getOneAppointment,
  getOneIncompletePatient,
  getOnePatient,
  getOneUniversity,
  getOnePsy,
  getOneInactivePsy,
  getOnePsyDS,
  getOneStudent,
  insertOnePsy,
  insertOneAppointment,
  insertOneStudent,
};
