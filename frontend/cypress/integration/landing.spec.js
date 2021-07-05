describe('Landing Page Test', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/config')
      .as('config');
    cy.intercept('GET', '/api/statistics')
      .as('statistics');
  });

  it('display landing page and load config', () => {
    cy.visit('/');
    cy.wait('@config');
    cy.get('[data-test-id="landingPageContainer"]').should('exist');
  });

  it('shows statistics', () => {
    cy.visit('/');
    cy.wait('@statistics');
    cy.get('[data-test-id="statistic-Universités partenaires"]').should('exist');
    cy.get('[data-test-id="statistic-Universités partenaires-value"]').should('have.text', 11);
    cy.get('[data-test-id="statistic-Psychologues partenaires"]').should('exist');
    cy.get('[data-test-id="statistic-Psychologues partenaires-value"]').should('have.text', 12);
    cy.get('[data-test-id="statistic-Patients accompagnés"]').should('exist');
    cy.get('[data-test-id="statistic-Patients accompagnés-value"]').should('have.text', 55);
  });
});
