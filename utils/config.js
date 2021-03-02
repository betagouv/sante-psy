require('dotenv').config();

const isSecure = (process.env.SECURE || 'true') === 'true';

module.exports = {
  appName: `Santé Psy Étudiants`,
  secure: isSecure,
  protocol: isSecure ? 'https' : 'http',
  activateDebug: (process.env.ACTIVATE_DEBUG_LOG || 'true') === 'false',
  host: process.env.HOSTNAME,
  port: process.env.PORT || 8080,
  contactEmail: process.env.CONTACT_EMAIL || 'contact-santepsyetudiants@beta.gouv.fr',
  apiToken: process.env.API_TOKEN,
  apiUrl: process.env.API_URL ||
    'https://www.demarches-simplifiees.fr/api/v2/graphql',
  databaseUrl: process.env.DATABASE_URL,
  demarchesSimplifieesId: process.env.DEMARCHES_SIMPLIFIEES_ID,
  demarchesSimplifieesUrl: process.env.DEMARCHES_SIMPLIFIEES_URL,
  featurePsyList: process.env.FEATURE_PSY_LIST || false,
  featureImportData: process.env.FEATURE_IMPORT_DATA || false,
  featurePsyPages: process.env.FEATURE_PSY_PAGES || false,
  uuidNamespace: process.env.UUID_NAMESPACE, // used to generate uuid 
  secret: process.env.SECRET,
  sessionDurationHours: process.env.SESSION_DURATION_HOURS || '2', // duration in hours
  //mail
  hostnameWithProtocol: process.env.HOSTNAME_WITH_PROTOCOL || 'http://localhost:8080',
  mailDebug: process.env.MAIL_DEBUG === 'true',
  mailService: process.env.MAIL_SERVICE ? process.env.MAIL_SERVICE : null,
  mailHost: process.env.MAIL_SERVICE ? null : process.env.MAIL_HOST,
  mailPort: process.env.MAIL_SERVICE ? null : parseInt(process.env.MAIL_PORT || '25', 10),
  ignoreTLS: process.env.MAIL_SERVICE ? null : process.env.MAIL_IGNORE_TLS === 'true',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
};
