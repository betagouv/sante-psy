const isSecure = (process.env.SECURE || 'true') === 'true';

module.exports = {
  secure: isSecure,
  protocol: isSecure ? 'https' : 'http',
  host: process.env.HOSTNAME,
  port: process.env.PORT || 8100,
  apiToken: process.env.API_TOKEN,
  apiUrl: process.env.API_URL || 'https://www.demarches-simplifiees.fr/api/v2/graphql',
  demarchesSimplifieesId: process.env.DEMARCHES_SIMPLIFIEES_ID,
  secret: process.env.SECRET
};