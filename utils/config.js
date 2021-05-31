require('dotenv').config();

const hostnameWithProtocol = process.env.HOSTNAME_WITH_PROTOCOL || 'http://localhost:8080';
const { protocol } = new URL(hostnameWithProtocol);

const secret = process.env.SECRET;
const secretLogs = process.env.SECRET_LOGS;
if (!secret || !secretLogs) {
  console.error('Mandatory configurations SECRET or SECRET_LOG is/are missing');
}

module.exports = {
  appName: 'Santé Psy Étudiant',
  activateDebug: (process.env.ACTIVATE_DEBUG_LOG || 'true') === 'false',
  announcement: process.env.ANNOUNCEMENT || '',
  port: process.env.PORT || 8080,
  teamEmail: process.env.TEAM_EMAIL || 'equipe-santepsyetudiants@beta.gouv.fr',
  contactEmail: process.env.CONTACT_EMAIL || 'contact-santepsyetudiants@beta.gouv.fr',
  apiToken: process.env.API_TOKEN,
  apiUrl: process.env.API_URL
    || 'https://www.demarches-simplifiees.fr/api/v2/graphql',
  databaseUrl: process.env.DATABASE_URL,
  dateOfBirthDeploymentDate: process.env.DATE_OF_BIRTH_FEATURE_DATE || '20/04/2021',
  demarchesSimplifieesId: process.env.DEMARCHES_SIMPLIFIEES_ID,
  demarchesSimplifieesUrl: process.env.DEMARCHES_SIMPLIFIEES_URL,
  sentryDNS: process.env.SENTRY_DNS || false,
  featurePsyList: process.env.FEATURE_PSY_LIST || false,
  featureImportData: process.env.FEATURE_IMPORT_DATA || false,
  featureSendSummary: process.env.FEATURE_SEND_SUMMARY || false,
  featurePsyPages: process.env.FEATURE_PSY_PAGES || false,
  featureReimbursementPage: (process.env.FEATURE_REIMBURSEMENT_PAGE === 'true'),
  uuidNamespace: process.env.UUID_NAMESPACE, // used to generate uuid
  secret,
  secretLogs,
  sessionDurationHours: process.env.SESSION_DURATION_HOURS || '2', // duration in hours
  useCors: (process.env.USE_CORS || 'false') === 'true',
  speedLimitation: (process.env.SPEED_LIMITATION || 'true') === 'true',
  testEnvironment: (process.env.TEST_ENVIRONMENT || 'false') === 'true',
  // mail
  hostnameWithProtocol,
  protocol,
  isSecure: protocol === 'https:',
  mailDebug: process.env.MAIL_DEBUG === 'true',
  mailService: process.env.MAIL_SERVICE ? process.env.MAIL_SERVICE : null,
  mailHost: process.env.MAIL_SERVICE ? null : process.env.MAIL_HOST,
  mailPort: process.env.MAIL_SERVICE ? null : parseInt(process.env.MAIL_PORT || '25', 10),
  ignoreTLS: process.env.MAIL_SERVICE ? null : process.env.MAIL_IGNORE_TLS === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  satistics: {
    base: process.env.METABASE_URL || 'https://stats.santepsyetudiant.beta.gouv.fr',
    dashboard: process.env.METABASE_DASHBOARD || '/public/dashboard/a3834fd4-aa00-4ee2-a119-11dd2156e082',
  },
};
