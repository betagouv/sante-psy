require('dotenv').config();

const isSecure = (process.env.SECURE || 'true') === 'true';

module.exports = {
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
};
