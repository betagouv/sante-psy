require('dotenv').config();

const isSecure = (process.env.SECURE || 'true') === 'true';

module.exports = {
  secure: isSecure,
  protocol: isSecure ? 'https' : 'http',
  host: process.env.HOSTNAME,
  port: process.env.PORT || 8100,
  apiToken: process.env.API_TOKEN,
  apiUrl: process.env.API_URL ||
    'https://www.demarches-simplifiees.fr/api/v2/graphql',
  databaseUrl: process.env.DATABASE_URL,
  demarchesSimplifieesId: process.env.DEMARCHES_SIMPLIFIEES_ID,
  demarchesSimplifieesUrl: process.env.DEMARCHES_SIMPLIFIEES_URL,
  secret: process.env.SECRET,
  featurePsyList: process.env.FEATURE_PSY_LIST || false,
  FEATURE_PSY_PAGES: process.env.FEATURE_PSY_PAGES || false,
};
