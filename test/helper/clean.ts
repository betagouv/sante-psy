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
    diploma: 'Psychologie clinique de la santé',
    phone: faker.phone.phoneNumber('0# ## ## ## ##'),
    email: faker.internet.exampleEmail(),
    personalEmail,
    website: getFakeAddress(),
    teleconsultation: faker.datatype.boolean(),
    description: faker.lorem.paragraphs(2),
    // eslint-disable-next-line max-len
    training: '["Connaissance et pratique des outils diagnostic psychologique","Connaissance des troubles psychopathologiques du jeune adulte : dépressions","risques suicidaires","addictions","comportements à risque","troubles alimentaires","décompensation schizophrénique","psychoses émergeantes ainsi qu’une pratique de leur repérage","Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)"]',
    assignedUniversityId: uniId,
    isConventionSigned: false,
    languages: 'Français, Anglais, et Espagnol',
    active: !inactiveUntil,
    inactiveUntil,
    createdAt: new Date(),
    ...getAddress(),
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

const cleanDataCursor = async (): Promise<void> => { await db(dsApiCursorTable).del(); };

const cleanDataToken = async (): Promise<void> => { await db(loginTokenTable).del(); };

const cleanAllAppointments = async (): Promise<void> => { await db(appointmentsTable).del(); };

const cleanAllPatients = async (): Promise<void> => {
  await cleanAllAppointments();
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
