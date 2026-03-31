import helmet from 'helmet';

const defaultDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();
const crispDomains = ['https://*.crisp.chat', 'https://*.crisp.help'];

export default helmet.contentSecurityPolicy({
  directives: {
    ...defaultDirectives,
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
      ...crispDomains,
      // Crisp chat script hash
      "'sha256-t4VtNIUiuBKi5VJfKaIxe2Ww1/6O3gae/Qtmhx4B0uE='",
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
      ...crispDomains,
      'data:',
    ],
    'frame-src': [
      'https://santepsy-metabase.osc-secnum-fr1.scalingo.io',
      'https://stats.santepsyetudiant.beta.gouv.fr',
      'https://embed.acast.com/kaavan-podcast?feed=true&theme=light&wmode=opaque',
      'https://bid.g.doubleclick.net/',
      'https://game.crisp.chat',
      ...crispDomains,
    ],
    'connect-src': [
      "'self'",
      'https://nominatim.openstreetmap.org',
      'https://stats.beta.gouv.fr/',
      'https://client.axept.io/',
      'wss://client.relay.crisp.chat',
      'https://client.crisp.chat',
      'https://storage.crisp.chat',
      'wss://stream.relay.crisp.chat',
      'https://cdn.jsdelivr.net',
      ...crispDomains,
      'https://data.geopf.fr',
    ],
  },
});
