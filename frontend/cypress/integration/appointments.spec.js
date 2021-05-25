const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');
const { removeConvention } = require('./utils/psychologist');

describe('Appointments', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/appointments')
      .as('appointments');
    cy.intercept('DELETE', '/api/appointments/*')
      .as('deleteAppointment');
    cy.intercept('GET', '/api/config')
      .as('config');

    resetDB();
    loginAsDefault();

    cy.visit('/psychologue/mes-seances');
    cy.wait('@config');
    cy.wait('@appointments');
  });

  describe('Display', () => {
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

    it('should display convention reminder only when no convention', () => {
      cy.get('[data-test-id="notification-success"]')
        .should('not.exist');
      removeConvention('login@beta.gouv.fr');
      cy.reload();
      cy.get('[data-test-id="notification-success"]')
        .should(
          'have.text',
          'Veuillez indiquer l‘état de votre conventionnement sur la page Remboursement de mes séances',
        );
    });
  });

  describe('Remove', () => {
    it('should remove appointement and notify user', () => {
      cy.get('[data-test-id="delete-appointment-button-large"]')
        .first()
        .click();
      cy.wait('@deleteAppointment');
      cy.get('[data-test-id="appointment-row"]')
        .should('have.length', 4);
      cy.get('[data-test-id="notification-success"]')
        .should(
          'have.text',
          'La séance a bien été supprimée.',
        );
    });
  });
});
