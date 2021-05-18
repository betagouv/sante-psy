const helmet = require('helmet');

module.exports = helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': ["'self'", 'https://stats.data.gouv.fr/', 'https://*.hotjar.com'],
    'img-src': ["'self'", 'https://stats.data.gouv.fr/', 'data:'],
    'frame-src': ['https://*.hotjar.com'],
    'connect-src': ['https://*.hotjar.com'],
  },
});
