const { resetDB } = require('./utils/db');

describe('Psy Listing', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/trouver-un-psychologue/reduced').as('psychologists');
    cy.intercept('GET', '/api/psychologist/*').as('psychologist');

    resetDB();
  });

  it('Should display table and redirect to public profile page', () => {
    cy.visit('/trouver-un-psychologue');
    cy.wait('@psychologists');

    cy.get('[data-test-id="psy-table"]').should('exist');

    cy.get('[data-test-id="psy-row"]').should('have.length', 9);

    cy.get('[data-test-id="psy-table-row-profil-button"]').eq(2).click();

    cy.wait('@psychologist');

    cy.get('[data-test-id="psy-info"]').should('have.length', 7);
  });
});
