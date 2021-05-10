describe('Landing Page Test', () => {
  it('display landing page', () => {
    cy.visit('/');
    cy.get('[data-test-id="landingPageContainer"]').should('exist');
  });
});
