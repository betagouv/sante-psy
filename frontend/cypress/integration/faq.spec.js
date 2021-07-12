describe('FAQ Page Test', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/config')
      .as('config');
  });

  it('display faq page with default tab', () => {
    cy.visit('/faq');
    cy.wait('@config');

    cy.get('[data-test-id="faqPage"]').should('exist');
    cy.get('[data-test-id="tabpanel-etudiant"]').should('be.visible');
    cy.get('[data-test-id="tabpanel-psychologue"]').should('not.be.visible');
    cy.get('[data-test-id="tabpanel-medecin"]').should('not.be.visible');
  });

  it('display faq page with specific tab', () => {
    cy.visit('/faq?section=psychologue');
    cy.wait('@config');

    cy.get('[data-test-id="faqPage"]').should('exist');
    cy.get('[data-test-id="tabpanel-etudiant"]').should('not.be.visible');
    cy.get('[data-test-id="tabpanel-psychologue"]').should('be.visible');
    cy.get('[data-test-id="tabpanel-medecin"]').should('not.be.visible');
  });
});
