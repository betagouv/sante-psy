const helmet = require('helmet');

module.exports = helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': [
      "'self'",
      'https://stats.data.gouv.fr/',
      'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
      // Matomo script hash
      "'sha256-bxHyhHOLabD1gVcjeft+G265+GG3VVqWzPZIJNBlpyU='",
    ],
    'img-src': ["'self'", 'https://stats.data.gouv.fr/', 'data:'],
    'frame-src': ['https://stats.santepsyetudiant.beta.gouv.fr'],
    'connect-src': ["'self'", 'https://nominatim.openstreetmap.org'],
  },
});
