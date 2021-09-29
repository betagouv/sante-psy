import helmet from 'helmet';

export default helmet.contentSecurityPolicy({
  directives: {
    ...helmet.contentSecurityPolicy.getDefaultDirectives(),
    'script-src': [
      "'self'",
      'https://stats.data.gouv.fr/',
      // Matomo script hash
      "'sha256-4sJsjD6jok0r8RIemFeNZ1nEQfYv6qdzYIaUCTrSIhs='",
    ],
    'img-src': [
      "'self'",
      'https://stats.data.gouv.fr/',
      'https://*.tile.openstreetmap.org/',
      'data:',
    ],
    'frame-src': ['https://stats.santepsyetudiant.beta.gouv.fr'],
    'connect-src': [
      "'self'",
      'https://nominatim.openstreetmap.org',
      'https://stats.data.gouv.fr/',
    ],
    'style-src': [
      "'self'",
      'https://',
      "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
      "'sha256-I6xMVwzl3lA4tretIHP7NI2mVbBZnq71Kf1ePqQ+nPE='",
      "'sha256-Af18gpTskrf6dKIsrufX3WaUKmITu7cqVqjHfxy1bJ4='",
      "'sha256-p+zyQT3QZqmLFdfr2tBjzqi7ZRl37CzgAxK2meDZqfk='",
      "'sha256-Juy/dqDy1gy1mQy4F6mUri5UHx+atHEcvCxdvfnDs2w='",
    ],
  },
});
