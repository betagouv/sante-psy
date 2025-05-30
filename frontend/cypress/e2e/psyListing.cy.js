const { resetDB } = require('./utils/db');

describe('Psy Listing', () => {
  beforeEach(() => {
    cy.intercept('GET', /\/api\/trouver-un-psychologue\/reduced\?.*/).as('psychologists');
    cy.intercept('GET', '/api/psychologist/*').as('psychologist');

    resetDB();
  });

  it('Should display table when filter search and redirect to public profile page', () => {
    cy.visit('/trouver-un-psychologue');
    cy.get('[data-test-id="speciality-input"]').type('alimentaire');
    cy.get('[data-test-id="psy-search"]').click();
    cy.wait('@psychologists');

    cy.get('[data-test-id="psy-table"]').should('exist');

    cy.get('[data-test-id="psy-row"]').should('have.length', 10);

    cy.get('[data-test-id="psy-table-row-profil-button"]').eq(2).click();

    cy.wait('@psychologist');

    cy.get('[data-test-id="psy-info"]').should('have.length', 7);
  });

  it('Shouldn\'t display table when no filter in search', () => {
    cy.visit('/trouver-un-psychologue');
    cy.get('[data-test-id="psy-search"]').click();

    cy.get('[data-test-id="psy-table"]').should('not.exist');

    cy.get('[data-test-id="psy-row"]').should('have.length', 0);
    cy.get('[data-test-id="notification-error"] p')
      .should(
        'have.text',
        'Veuillez entrer au moins un critère de recherche.',
      );
    cy.get('@psychologists.all').should('have.length', 0);
  });
});
