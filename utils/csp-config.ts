import helmet from 'helmet';

export default helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': [
      "'self'",
      'https://stats.data.gouv.fr/',
      'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
      // Matomo script hash
      "'sha256-4sJsjD6jok0r8RIemFeNZ1nEQfYv6qdzYIaUCTrSIhs='",
    ],
    'img-src': [
      "'self'",
      'https://stats.data.gouv.fr/',
      'https://unpkg.com/leaflet@1.7.1/dist/images/',
      'https://*.tile.openstreetmap.org/',
      'data:',
    ],
    'frame-src': ['https://stats.santepsyetudiant.beta.gouv.fr'],
    'connect-src': [
      "'self'",
      'https://nominatim.openstreetmap.org',
      'https://stats.data.gouv.fr/',
    ],
  },
});
