console.log('config.js : process.env.DATABASE_URL before dotenv', process.env.DATABASE_URL)
require('dotenv').config();
console.log('config.js : process.env.DATABASE_URL after dotenv', process.env.DATABASE_URL)

const isSecure = (process.env.SECURE || 'true') === 'true';

const config = {
  secure: isSecure,
  protocol: isSecure ? 'https' : 'http',
  host: process.env.HOSTNAME,
  port: process.env.PORT || 8080,
  apiToken: process.env.API_TOKEN,
  apiUrl: process.env.API_URL ||
    'https://www.demarches-simplifiees.fr/api/v2/graphql',
  databaseUrl: process.env.DATABASE_URL,
  demarchesSimplifieesId: process.env.DEMARCHES_SIMPLIFIEES_ID,
  demarchesSimplifieesUrl: process.env.DEMARCHES_SIMPLIFIEES_URL,
  secret: process.env.SECRET,
  featurePsyList: process.env.FEATURE_PSY_LIST || false,
  featurePsyPages: process.env.FEATURE_PSY_PAGES || false,
};
module.exports = config

console.log('got config', config)