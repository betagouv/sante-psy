const helmet = require('helmet');

module.exports = helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': [
      "'self'",
      'https://stats.data.gouv.fr/',
      // Matomo script hash
      "'sha256-ea3WZc2AKn6qnZP0bQrrFCpem5WlK5ar5m7kUcKLAeE='",
    ],
    'img-src': ["'self'", 'https://stats.data.gouv.fr/', 'data:'],
    'frame-src': ['https://stats.santepsyetudiant.beta.gouv.fr'],
  },
});
