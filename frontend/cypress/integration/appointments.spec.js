const { loginAsDefault } = require('./utils/login');

describe('Appointments', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/appointments')
      .as('appointments');
    cy.intercept('GET', '/api/config')
      .as('config');

    loginAsDefault();

    cy.visit('/psychologue/mes-seances');
    cy.wait('@config');
    cy.wait('@appointments');
  });

  it('should get appointments', () => {
    cy.get('[data-test-id="appointment-row"]')
      .should('have.length', 5);
  });

  it('should display default announcement only once', () => {
    cy.get('[data-test-id="notification-error"]')
      .should(
        'have.text',
        '(Docker-compose variable) Pour déclarer vos séances,'
        + ' veuillez indiquer l\'état de votre conventionnement ainsi que votre université de référence.',
      );
    cy.get('[data-test-id="notification-close"]')
      .click();
    cy.get('[data-test-id="notification-error"]')
      .should('not.exist');
    cy.reload();
    cy.get('[data-test-id="notification-error"]')
      .should('not.exist');
  });
});
