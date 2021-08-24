const { checkConvention } = require('../../src/services/conventionVerification');
const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');

describe('Patient', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/patients')
      .as('etudiants');
    cy.intercept('DELETE', '/api/patients/*')
      .as('deleteEtudiants');
    cy.intercept('GET', '/api/patients/*')
      .as('etudiant');
    cy.intercept('GET', '/api/config')
      .as('config');

    resetDB();
    loginAsDefault();
    checkConvention();

    cy.visit('/psychologue/mes-etudiants');
    cy.wait('@config');
    cy.wait('@etudiants');
  });

  describe('Display', () => {
    it('should get etudiants', () => {
      cy.get('[data-test-id="etudiant-table"] tr')
        .should('have.length', 6);
      cy.get('[data-test-id="etudiant-row-missing-info"]')
        .should('have.length', 1);
      cy.get('[data-test-id="etudiant-row-complete-info"]')
        .should('have.length', 4);
    });
  });

  describe('Update', () => {
    it('should update existing etudiant and update completion info', () => {
      cy.get('[data-test-id="update-etudiant-button-large"]')
        .first()
        .click();
      cy.wait('@etudiant');

      cy.get('[data-test-id="etudiant-first-name-input"] > input')
        .clear()
        .type('A');
      cy.get('[data-test-id="etudiant-last-name-input"] > input')
        .clear()
        .type('B');
      cy.get('[data-test-id="etudiant-doctor-name-input"] > input')
        .type('C');
      cy.get('[data-test-id="save-etudiant-button"]')
        .click();

      cy.get('[data-test-id="etudiant-table"] tr')
        .should('have.length', 6);
      cy.get('[data-test-id="etudiant-row-complete-info"]')
        .should('have.length', 5);

      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          "L'étudiant A B a bien été modifié.",
        );
    });
  });

  describe('Remove', () => {
    it('should remove etudiant with incomplete info and notify user', () => {
      cy.get('[data-test-id="delete-etudiant-button-large"]')
        .first()
        .click();
      cy.wait('@deleteEtudiants');
      cy.get('[data-test-id="etudiant-table"] tr')
        .should('have.length', 5);
      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          "L'étudiant a bien été supprimé.",
        );
    });

    it('should remove etudiant with complete info and notify user', () => {
      cy.get('[data-test-id="delete-etudiant-button-large"]')
        .last()
        .click();
      cy.wait('@deleteEtudiants');
      cy.get('[data-test-id="etudiant-table"] tr')
        .should('have.length', 5);
      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          "L'étudiant a bien été supprimé.",
        );
    });
  });
});
