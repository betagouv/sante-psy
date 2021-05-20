describe('Landing Page Test', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/config')
      .as('config');
  });

  it('display landing page and load config', () => {
    cy.visit('/');
    cy.get('[data-test-id="landingPageContainer"]').should('exist');
    cy.wait('@config');
  });
});
