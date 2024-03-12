import helmet from 'helmet';

export default helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': [
      "'self'",
      'https://stats.beta.gouv.fr/',
      // Matomo script hash
      "'sha256-sqjiu0yVEwRFwPjX2fpBsUHfmtb6Cd2U2U+ip0KXg4c='",
      'https://static.axept.io/',
      'https://connect.facebook.net',
      'https://www.googletagmanager.com/',
      'https://www.googleadservices.com/',
      'https://googleads.g.doubleclick.net',
      'https://*.crisp.chat',
    ],
    'script-src-attr': [
      "'self'",
      "'unsafe-inline'",
    ],
    'img-src': [
      "'self'",
      'https://stats.beta.gouv.fr/',
      'https://*.tile.openstreetmap.org/',
      'https://axeptio.imgix.net',
      'https://www.google.com/',
      'https://www.google.fr/',
      'https://www.facebook.com',
      'https://googleads.g.doubleclick.net',
      'https://*.crisp.chat',
      'data:',
    ],
    'frame-src': [
      'https://santepsy-metabase.osc-secnum-fr1.scalingo.io',
      'https://stats.santepsyetudiant.beta.gouv.fr',
      'https://bid.g.doubleclick.net/',
    ],
    'connect-src': [
      "'self'",
      'https://nominatim.openstreetmap.org',
      'https://stats.beta.gouv.fr/',
      'https://client.axept.io/',
      'wss://client.relay.crisp.chat',
      'https://client.crisp.chat',
    ],
  },
});
