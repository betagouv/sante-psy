const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');

describe('Redirection', () => {
  before(() => {
    resetDB();
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/config')
      .as('config');
  });

  describe('Logged', () => {
    beforeEach(() => {
      loginAsDefault();
    });

    it('should redirect to mes seances page if unknown page but logged', () => {
      cy.visit('/psychologue/unknown-pizza');
      cy.wait('@config');
      cy.location('pathname').should('eq', '/psychologue/tableau-de-bord');
    });

    it('should redirect to mes seances page if unknown page without /psychologue/ but logged', () => {
      cy.visit('/unknown-pizza');
      cy.wait('@config');
      cy.location('pathname').should('eq', '/psychologue/tableau-de-bord');
    });
  });

  describe('Not logged', () => {
    it('should redirect to landing page if unknown page and not logged', () => {
      cy.visit('/unknown-pizza');
      cy.wait('@config');
      cy.location('pathname').should('eq', '/');
    });

    it('should redirect to login page if unknown page starting with /psychologue/ and not logged', () => {
      cy.visit('/psychologue/unknown-pizza');
      cy.wait('@config');
      cy.location('pathname').should('eq', '/psychologue/login');
    });
  });
});
