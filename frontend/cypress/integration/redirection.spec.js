const { login } = require('./utils/login');

describe('Redirection', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/config')
      .as('config');
  });

  const psy = {
    dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
    email: 'prenom.nom@beta.gouv.fr',
  };

  it('should redirect to landing page if unknown page and not logged', () => {
    cy.visit('/unknown-pizza');
    cy.wait('@config');
    cy.location('pathname').should('eq', '/');
  });

  it('should redirect to mes seances page if unknown page but logged', () => {
    login(psy);
    cy.visit('/psychologue/unknown-pizza');
    cy.wait('@config');
    cy.location('pathname').should('eq', '/psychologue/mes-seances');
  });

  it('should redirect to mes seances page if unknown page without /psychologue/ but logged', () => {
    login(psy);
    cy.visit('/unknown-pizza');
    cy.wait('@config');
    cy.location('pathname').should('eq', '/psychologue/mes-seances');
  });

  it('should redirect to login page if unknown page starting with /psychologue/ and not logged', () => {
    cy.visit('/psychologue/unknown-pizza');
    cy.wait('@config');
    cy.location('pathname').should('eq', '/psychologue/login');
  });
});
