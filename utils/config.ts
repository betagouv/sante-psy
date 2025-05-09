import dotenv from 'dotenv';
import { URL } from 'url';

dotenv.config();

const hostnameWithProtocol = process.env.HOSTNAME_WITH_PROTOCOL || 'http://localhost:8080';
const { protocol } = new URL(hostnameWithProtocol);

const secret = process.env.SECRET;
const secretLogs = process.env.SECRET_LOGS;
if (!secret || !secretLogs) {
  console.error('Mandatory configurations SECRET or SECRET_LOG is/are missing');
}

const contactEmail = process.env.CONTACT_EMAIL || 'contact-santepsyetudiants@beta.gouv.fr';

const getBooleanEnv = (value: string, defaultValue: string): boolean => (value || defaultValue) === 'true';

export default {
  appName: 'Santé Psy Étudiant',
  activateDebug: getBooleanEnv(process.env.ACTIVATE_DEBUG_LOG, 'false'),
  announcement: process.env.ANNOUNCEMENT || '',
  publicAnnouncement: process.env.PUBLIC_ANNOUNCEMENT || '',
  port: process.env.PORT || 8080,
  teamEmail: process.env.TEAM_EMAIL || 'equipe-santepsyetudiants@beta.gouv.fr',
  sendingEmail: process.env.SENDING_EMAIL || 'contact@santepsyetudiant.beta.gouv.fr',
  contactEmail,
  databaseUrl: process.env.DATABASE_URL,
  dateOfBirthDeploymentDate: process.env.DATE_OF_BIRTH_FEATURE_DATE || '20/04/2021',
  demarchesSimplifiees: {
    apiToken: process.env.API_TOKEN,
    apiUrl: process.env.API_URL
    || 'https://www.demarches-simplifiees.fr/api/v2/graphql',
    id: process.env.DEMARCHES_SIMPLIFIEES_ID,
    url: process.env.DEMARCHES_SIMPLIFIEES_URL,
    autoAcceptDepartments: process.env.DEMARCHES_SIMPLIFIEES_AUTO_ACCEPT_DEPARTMENTS || [],
    waitingForConventionDepartments: process.env.DEMARCHES_SIMPLIFIEES_WAITING_FOR_CONVENTION_DEPARTMENTS || [],
    instructor: process.env.DEMARCHES_SIMPLIFIEES_INSTRUCTOR,
    champs: process.env.DEMARCHES_SIMPLIFIEES_CHAMPS,
    annotations: process.env.DEMARCHES_SIMPLIFIEES_ANNOTATIONS,
  },
  sentryDNS: process.env.SENTRY_DNS || '',
  feature: {
    importData: getBooleanEnv(process.env.FEATURE_IMPORT_DATA, 'false'),
    checkMultipleFiles: getBooleanEnv(process.env.FEATURE_CHECK_MULTIPLE_FILES, 'false'),
    sendSummary: getBooleanEnv(process.env.FEATURE_SEND_SUMMARY, 'false'),
    autoAccept: getBooleanEnv(process.env.FEATURE_AUTO_ACCEPT, 'false'),
    autoVerify: getBooleanEnv(process.env.FEATURE_AUTO_VERIFY, 'false'),
  },
  uuidNamespace: process.env.UUID_NAMESPACE,
  secret,
  secretLogs,
  sessionDurationHours: process.env.SESSION_DURATION_HOURS || '2',
  refreshDurationHours: process.env.REFRESH_DURATION_HOURS || '1',
  useCors: getBooleanEnv(process.env.USE_CORS, 'false'),
  speedLimitation: getBooleanEnv(process.env.SPEED_LIMITATION, 'true'),
  testEnvironment: getBooleanEnv(process.env.TEST_ENVIRONMENT, 'false'),
  hostnameWithProtocol,
  isSecure: protocol === 'https:',
  mail: {
    debug: getBooleanEnv(process.env.MAIL_DEBUG, 'false'),
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '25', 10),
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
    secure: getBooleanEnv(process.env.MAIL_SECURE, 'false'),
    requireTLS: getBooleanEnv(process.env.MAIL_REQUIRE_TLS, 'true'),
  },
  statistics: {
    base: process.env.METABASE_URL || 'https://stats.santepsyetudiant.beta.gouv.fr',
    dashboard: process.env.METABASE_DASHBOARD || '/public/dashboard/a3834fd4-aa00-4ee2-a119-11dd2156e082',
    nbInstaFollower: process.env.INSTAGRAM_FOLLOWER || '22 100',
  },
  crisp: {
    identifier: process.env.CRISP_IDENTIFIER,
    key: process.env.CRISP_KEY,
    website: process.env.CRISP_WEBSITE,
  },
  minScoreAddress: parseFloat(process.env.MIN_SCORE_ADDRESS || '0.55'),
  apiIneToken: process.env.API_INE_TOKEN,
  apiIneUrl: process.env.API_INE_URL,
};
