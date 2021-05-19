const { login } = require('./utils/login');

describe('Redirection', () => {
  const psy = {
    dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
    email: 'prenom.nom@beta.gouv.fr',
  };

  it('should redirect to landing page if unknown page and not loggued', () => {
    cy.visit('/unknown-pizza');
    cy.location('pathname').should('eq', '/');
  });

  it('should redirect to mes seacnces page if unknown page but loggued', () => {
    login(psy);
    cy.visit('/psychologue/unknown-pizza');
    cy.location('pathname').should('eq', '/psychologue/mes-seances');
  });

  it('should redirect to mes seacnces page if unknown page without /psychologue/ but loggued', () => {
    login(psy);
    cy.visit('/unknown-pizza');
    cy.location('pathname').should('eq', '/psychologue/mes-seances');
  });

  it('should redirect to login page if unknown page starting with /psychologue/ and not loggued', () => {
    cy.visit('/psychologue/unknown-pizza');
    cy.location('pathname').should('eq', '/psychologue/login');
  });
});
