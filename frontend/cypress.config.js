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
    // defaultCommandTimeout: 10000,
    // requestTimeout: 10000,
    // responseTimeout: 10000,
    // pageLoadTimeout: 10000,
    // animationDistanceThreshold: 5,
    defaultCommandTimeout: 20000,
    requestTimeout: 15000,
    responseTimeout: 20000,
    pageLoadTimeout: 30000,
    animationDistanceThreshold: 20,
  },
});
