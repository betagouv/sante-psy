/* eslint-disable cypress/no-unnecessary-waiting */
const { checkConvention } = require('../../src/services/conventionVerification');
const { loginAsDefault } = require('./utils/login');
const { resetDB, resetTutorial } = require('./utils/db');

const currentYear = new Date().getFullYear();

const checkAllSteps = numberOfSteps => {
  // go the the ante last step
  for (let i = 0; i < numberOfSteps - 1; i++) {
    cy.wait(100);
    cy.get('[data-test-id="next-step"]')
      .click();
  }

  // go back to the begining
  for (let i = 0; i < numberOfSteps - 1; i++) {
    cy.wait(100);
    cy.get('[data-test-id="previous-step"]')
      .click();
  }

  cy.get('[data-test-id="previous-step"]')
    .should('not.exist');

  // go the the last step
  for (let i = 0; i < numberOfSteps; i++) {
    cy.wait(100);
    cy.get('[data-test-id="next-step"]')
      .click();
  }

  // end tuto
  cy.get('[data-test-id="end-tutorial"]')
    .click();
};

describe('Global tutorial', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/connecteduser')
      .as('connecteduser');

    resetDB();
    loginAsDefault();
    checkConvention();
    resetTutorial();

    cy.visit('/psychologue/tableau-de-bord');
    cy.wait('@connecteduser');
  });

  it('should display full tuto in both directions', () => {
    checkAllSteps(13);
    cy.reload();
    cy.wait('@connecteduser');
    cy.get('[data-test-id="next-step"]')
      .should('not.exist');
  });

  it('should pass tuto', () => {
    cy.get('[data-test-id="close-tutorial"]')
      .click();
    cy.get('[data-test-id="next-step"]')
      .should('not.exist');

    cy.reload();
    cy.wait('@connecteduser');
    cy.get('[data-test-id="next-step"]')
      .should('not.exist');
  });
});

const tutorials = [
  { page: 'tableau-de-bord', steps: 4 },
  { page: 'mes-seances', steps: 3 },
  { page: 'nouvelle-seance', steps: 4 },
  { page: 'mes-etudiants', steps: 3 },
  { page: 'nouvel-etudiant', steps: 3 },
  { page: 'mon-profil', steps: 4 },
];
describe('Other tutorials', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/connecteduser')
      .as('connecteduser');

    resetDB();
    loginAsDefault();
    checkConvention();
  });

  tutorials.map(tutorial => it(`Should display tutorial for ${tutorial.page}`, () => {
    cy.visit(`/psychologue/${tutorial.page}`);
    cy.wait('@connecteduser');
    cy.get('[data-test-id="launch-tutorial"]')
      .click();

    checkAllSteps(tutorial.steps);
  }));

  it('should display billing tutorial when appointments', () => {
    const now = new Date(currentYear, 1, 1).getTime();
    cy.clock(now);
    cy.visit('/psychologue/mes-remboursements');
    cy.wait('@connecteduser');
    cy.get('[data-test-id="launch-tutorial"]')
      .click();

    checkAllSteps(7);
  });

  it('should display billing tutorial when no appointments', () => {
    const now = new Date(currentYear - 1, 1, 1).getTime();
    cy.clock(now);
    cy.visit('/psychologue/mes-remboursements');
    cy.wait('@connecteduser');
    cy.get('[data-test-id="launch-tutorial"]')
      .click();

    checkAllSteps(6);
  });
});
