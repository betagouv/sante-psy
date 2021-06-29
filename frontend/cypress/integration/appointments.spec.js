const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');
const { removeConvention, suspend, signConvention } = require('./utils/psychologist');

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
    signConvention('Angers', true);

    cy.visit('/psychologue/mes-seances');
    cy.wait('@config');
    cy.wait('@appointments');
  });

  describe('Display', () => {
    it('should get appointments', () => {
      cy.get('[data-test-id="appointment-row"]')
        .should('have.length', 13);
    });

    it('should display default announcement only once', () => {
      cy.get('[data-test-id="notification-error"]')
        .should(
          'have.text',
          '(Docker-compose variable) Very important announcement.',
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
      // Only error message is the announcement
      cy.get('[data-test-id="notification-error"]')
        .should('have.length', 1);
      removeConvention('login@beta.gouv.fr');
      cy.reload();
      // Now we have both
      cy.get('[data-test-id="notification-error"]')
        .should('have.length', 2)
        .last()
        .should(
          'have.text',
          'Veuillez indiquer l‘état de votre conventionnement sur la page Mes informations',
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
        .should('have.length', 12);
      cy.get('[data-test-id="notification-success"]')
        .should(
          'have.text',
          'La séance a bien été supprimée.',
        );
    });
  });

  describe('Suspended profile', () => {
    it('should display warning if psy is suspended', () => {
      cy.get('[data-test-id="notification-close"]')
        .click();
      suspend().then(() => {
        cy.reload();
        cy.get('[data-test-id="notification-error"]')
          .should(
            'have.text',
            'Votre profil n‘est plus visible dans l‘annuaire. Pour que les étudiants puissent vous contacter, rendez vous sur la page Mes informations.',
          );
      });
    });
  });
});
