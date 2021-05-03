const helmet = require('helmet');

module.exports = helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': ["'self'", 'https://stats.data.gouv.fr/'],
    'img-src': ["'self'", 'https://stats.data.gouv.fr/', 'data:'],
  },
});
