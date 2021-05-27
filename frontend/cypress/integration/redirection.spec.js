const { loginAsDefault } = require('./utils/login');

describe('Redirection', () => {
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
      cy.location('pathname').should('eq', '/psychologue/mes-seances');
    });

    it('should redirect to mes seances page if unknown page without /psychologue/ but logged', () => {
      cy.visit('/unknown-pizza');
      cy.wait('@config');
      cy.location('pathname').should('eq', '/psychologue/mes-seances');
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
