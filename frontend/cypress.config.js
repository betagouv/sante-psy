// eslint-disable-next-line import/no-extraneous-dependencies
const { defineConfig } = require('cypress');
const plugin = require('./cypress/plugins');

module.exports = defineConfig({
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return plugin(on, config);
    },
    baseUrl: 'http://localhost:3000/',
    specPattern: 'cypress/e2e/**/*.cy.js',
  },
});
