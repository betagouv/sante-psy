describe('Landing Page Test', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/config').as('config');
    cy.intercept('GET', '/api/statistics').as('statistics');
  });

  it('display landing page and load config', () => {
    cy.visit('/');
    cy.wait('@config');
    cy.get('[data-test-id="landingPageContainer"]').should('exist');
    cy.get('[data-test-id="followInstagramDescription"]').should($desc => expect($desc).to.contain('16 000'));
  });

  it('shows statistics', () => {
    cy.visit('/');
    cy.wait('@statistics');
    cy.get('[data-test-id="statistic-Séances réalisées"]').should('exist');
    cy.get('[data-test-id="statistic-Psychologues disponibles"]').should('exist');
    cy.get('[data-test-id="statistic-Psychologues disponibles-value"]').should('have.text', '12 +');
    cy.get('[data-test-id="statistic-Étudiants accompagnés"]').should('exist');
  });
});
