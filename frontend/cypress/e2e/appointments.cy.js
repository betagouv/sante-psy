const { checkConvention } = require('../../src/services/conventionVerification');
const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');
const { selectPreviousCalendarDate } = require('./utils/calendar');
const { removeConvention, suspend } = require('./utils/psychologist');

describe('Appointments', () => {
  beforeEach(() => {
    cy.intercept({
      method: 'GET',
      pathname: '/api/appointments',
    }).as('appointments');
    cy.intercept('POST', '/api/appointments').as('createAppointment');
    cy.intercept('DELETE', '/api/appointments/*').as('deleteAppointment');
    cy.intercept('GET', '/api/config').as('config');

    resetDB();
    loginAsDefault();
    checkConvention();

    cy.visit('/psychologue/mes-seances');
    cy.wait('@config');
    cy.wait('@appointments');
  });

  describe('Display', () => {
    it('should get appointments', () => {
      cy.get('[data-test-id="appointments-table"] tr').should(
        'have.length',
        14,
      );
    });

    it('should display default announcement only once', () => {
      cy.get('[data-test-id="notification-info"] p')
        .last()
        .should(
          'have.text',
          '(Docker-compose variable) Very important announcement.',
        );
      cy.get('[data-test-id="notification-info"] button').click();
      cy.get('[data-test-id="notification-info"] p').should('not.exist');
      cy.reload();
      cy.get('[data-test-id="notification-info"] p').should('not.exist');
    });

    it('should display convention reminder only when no convention', () => {
      // Only error message is the announcement
      cy.get('[data-test-id="notification-info"]').should('have.length', 1);
      removeConvention('login@beta.gouv.fr');
      cy.reload();
      // Now we have both
      cy.get('[data-test-id="notification-info"] p')
        .should('have.length', 2)
        .last()
        .should(
          'have.text',
          'Veuillez indiquer l‘état de votre conventionnement sur la page Ma convention',
        );
    });
  });

  describe('Remove', () => {
    it('should remove appointement and notify user', () => {
      cy.get('[data-test-id="delete-appointment-button-large"]')
        .first()
        .click();
      cy.wait('@deleteAppointment');
      cy.get('[data-test-id="appointments-table"] tr').should(
        'have.length',
        13,
      );
      cy.get('[data-test-id="notification-success"] p').should(
        'have.text',
        'La séance a bien été supprimée.',
      );
    });
  });

  describe('Suspended profile', () => {
    it('should display warning if psy is suspended', () => {
      suspend().then(() => {
        cy.reload();
        cy.get('[data-test-id="notification-warning"] p').should(
          'have.text',
          "Votre profil n‘est plus visible dans l‘annuaire. En cette période d'examens, les demandes d'étudiants sont en constante augmentation, nous sollicitons donc votre participation. Pour que les étudiants puissent vous contacter, rendez vous sur la page Ma disponibilité.",
        );
      });
    });
  });

  describe('New', () => {
    it('should not allow selecting a future date', () => {
      cy.get('[data-test-id="new-appointment-button"]').click();
      cy.get('[data-test-id="new-appointment-etudiant-input"] input').click();
      cy.get('[data-test-id="new-appointment-etudiant-input"] div div')
        .contains('SharedPatient1')
        .click();

      cy.get('[data-test-id="etudiant-seances-list"]').should('exist');
      cy.get('[data-test-id="new-appointment-date-input"]').should('exist');
      cy.get('[data-test-id="new-appointment-date-input"]').click();

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dayToSelect = tomorrow.getDate();
      const selector = `.react-datepicker__day--0${dayToSelect < 10 ? `0${dayToSelect}` : dayToSelect}`;
      cy.get(selector).should('have.class', 'react-datepicker__day--disabled');

      cy.get('[data-test-id="new-appointment-submit"]').should('be.disabled');
    });

    it('should create a new previous appointments if student is selected', () => {
      cy.get('[data-test-id="new-appointment-button"]').click();

      cy.get('[data-test-id="new-appointment-etudiant-input"] input').click();

      cy.get('[data-test-id="new-appointment-etudiant-input"] div div')
        .contains('SharedPatient1')
        .click();

      cy.get('[data-test-id="etudiant-seances-list"]').should('exist');

      cy.get('[data-test-id="new-appointment-date-input"]').should('exist');

      cy.get('[data-test-id="new-appointment-date-input"]').click();

      selectPreviousCalendarDate();

      cy.get('[data-test-id="new-appointment-submit"]')
        .invoke('attr', 'disabled')
        .then(disabled => {
          if (disabled) {
            cy.get('[data-test-id="new-appointment-submit"]')
              .invoke('attr', 'disabled')
              .then(d => {
                if (d) {
                  cy.get('[data-test-id="new-appointment-understand"]').click();
                }
              });
          }
        });

      cy.get('[data-test-id="new-appointment-submit"]').click();

      cy.wait('@createAppointment');
      cy.location('pathname').should('eq', '/psychologue/mes-seances');
      cy.get('[data-test-id="notification-success"] p').should('exist');
    });

    it('should NOT be able to create a new appointment if selected student doesnt have valid INE', () => {
      cy.get('[data-test-id="new-appointment-button"]').click();

      cy.get('[data-test-id="new-appointment-etudiant-input"] input').click();

      cy.get('[data-test-id="new-appointment-etudiant-input"] div div')
        .contains('SharedPatient2')
        .click();

      cy.get('[data-test-id="etudiant-seances-list"]').should('exist');

      cy.get('[data-test-id="new-appointment-date-input"]').should('exist');

      cy.get('[data-test-id="new-appointment-date-input"]').should('have.attr', 'disabled');

      cy.get('[data-test-id="new-appointment-submit"]').should('have.attr', 'disabled');

      cy.get('[data-test-id="alert-missing-data"]').should('exist');
    });
  });
});
