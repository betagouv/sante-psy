import helmet from 'helmet';

export default helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': [
      "'self'",
      'https://stats.data.gouv.fr/',
      // Matomo script hash
      "'sha256-4sJsjD6jok0r8RIemFeNZ1nEQfYv6qdzYIaUCTrSIhs='",
      'https://static.axept.io/',
      'https://connect.facebook.net',
      'https://www.googletagmanager.com/',
      'https://www.googleadservices.com/',
    ],
    'img-src': [
      "'self'",
      'https://stats.data.gouv.fr/',
      'https://*.tile.openstreetmap.org/',
      'https://axeptio.imgix.net',
      'data:',
    ],
    'frame-src': ['https://stats.santepsyetudiant.beta.gouv.fr'],
    'connect-src': [
      "'self'",
      'https://nominatim.openstreetmap.org',
      'https://stats.data.gouv.fr/',
      'https://client.axept.io/',
    ],
  },
});
