const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');

describe('Patients', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/patients')
      .as('patients');
    cy.intercept('DELETE', '/api/patients/*')
      .as('deletePatients');
    cy.intercept('PUT', '/api/patients/*')
      .as('modifyPatients');
    cy.intercept('GET', '/api/patients/*')
      .as('patient');
    cy.intercept('GET', '/api/config')
      .as('config');

    resetDB();
    loginAsDefault();

    cy.visit('/psychologue/mes-patients');
    cy.wait('@config');
    cy.wait('@patients');
  });

  describe('Display', () => {
    it('should get patients', () => {
      cy.get('[data-test-id="patient-row"]')
        .should('have.length', 5);
      cy.get('[data-test-id="patient-row-missing-info"]')
        .should('have.length', 1);
      cy.get('[data-test-id="patient-row-complete-info"]')
        .should('have.length', 4);
      cy.get('[data-test-id="patients-missing-info"]')
        .should('exist');
    });
  });

  describe('Update', () => {
    it('should update existing patient and update completion info', () => {
      cy.get('[data-test-id="update-patient-button-large"]')
        .first()
        .click();
      cy.wait('@patient');

      cy.get('[data-test-id="patient-first-name-input"] > input')
        .clear()
        .type('Georges');
      cy.get('[data-test-id="patient-last-name-input"] > input')
        .clear()
        .type('Moustaki');
      cy.get('[data-test-id="patient-doctor-name-input"] > input')
        .type('My doctor');
      cy.get('[data-test-id="save-patient-button"]')
        .click();

      cy.get('[data-test-id="patient-row"]')
        .should('have.length', 5);
      cy.get('[data-test-id="patient-row-complete-info"]')
        .should('have.length', 5);
      cy.get('[data-test-id="patients-missing-info"]')
        .should('not.exist');

      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          'Le patient Georges Moustaki a bien été modifié.',
        );
    });
  });

  describe('Remove', () => {
    it('should remove patient with incomplete info, notify user and remove message', () => {
      cy.get('[data-test-id="delete-patient-button-large"]')
        .first()
        .click();
      cy.wait('@deletePatients');
      cy.get('[data-test-id="patient-row"]')
        .should('have.length', 4);
      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          'Le patient a bien été supprimé.',
        );
      cy.get('[data-test-id="patients-missing-info"]')
        .should('not.exist');
    });

    it('should remove patient with complete info, notify user and not remove message', () => {
      cy.get('[data-test-id="delete-patient-button-large"]')
        .last()
        .click();
      cy.wait('@deletePatients');
      cy.get('[data-test-id="patient-row"]')
        .should('have.length', 4);
      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          'Le patient a bien été supprimé.',
        );
      cy.get('[data-test-id="patients-missing-info"]')
        .should('exist');
    });
  });
});
