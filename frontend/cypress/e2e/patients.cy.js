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
      cy.get('[data-test-id="etudiant-badges"]').should('exist');
    });
  });

  describe('Add', () => {
    it('should add etudiant', () => {
      cy.get('[data-test-id="new-student-button"]')
        .click();
      cy.get('[data-test-id="etudiant-first-name-input"] > input')
        .type('Titi');
      cy.get('[data-test-id="etudiant-last-name-input"] > input')
        .type('Toto');
      cy.get('[data-test-id="etudiant-birth-date-input"] > input')
        .type('01/01/2001');
      cy.get('[data-test-id="etudiant-school-input"] > input')
        .type('Université de Rennes');
      cy.get('[data-test-id="etudiant-ine-input"] > input')
        .type('01020304');
      cy.get('[data-test-id="etudiant-status-input"]')
        .click();
      cy.get('[data-test-id="etudiant-letter-input"]')
        .click();
      cy.get('[data-test-id="etudiant-doctor-name-input"] > input')
        .type('Dr Dupont');
      cy.get('[data-test-id="etudiant-doctor-location-input"] > input')
        .type('Saint-Denis');
      cy.get('[data-test-id="etudiant-doctor-email-input"] > input')
        .type('email@email.comfr');
      cy.get('[data-test-id="etudiant-prescription-date-input"] > input')
        .type('01/01/2001');
      cy.get('[data-test-id="save-etudiant-button"]')
        .click();

      cy.get('[data-test-id="etudiant-table"] tr')
        .should('have.length', 7);
      cy.get('[data-test-id="etudiant-badges"]').should('exist');
      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          "L'étudiant Titi Toto a bien été créé.",
        );
    });
  });

  describe('Update', () => {
    it('should update existing etudiant and update completion info', () => {
      cy.get('[data-test-id="update-etudiant-button"]')
        .eq(1)
        .click();
      cy.wait('@etudiant');

      cy.get('[data-test-id="etudiant-seances-list"]').should('exist');

      cy.get('[data-test-id="etudiant-first-name-input"] > input')
        .clear()
        .type('Georges');
      cy.get('[data-test-id="etudiant-last-name-input"] > input')
        .clear()
        .type('Moustaki');
      cy.get('[data-test-id="etudiant-ine-input"] > input')
        .clear()
        .type('123456');

      cy.get('[data-test-id="etudiant-letter-input"]')
        .click();
      cy.get('[data-test-id="etudiant-letter-input"]')
        .click();

      cy.get('[data-test-id="etudiant-doctor-name-input"] > input')
        .type('My doctor');
      cy.get('[data-test-id="etudiant-doctor-email-input"] > input')
        .clear();
      cy.get('[data-test-id="save-etudiant-button"]')
        .click();

      cy.get('[data-test-id="etudiant-table"] tr')
        .should('have.length', 6);

      cy.get('[data-test-id="etudiant-badges"]').should('exist');

      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          'L\'étudiant Georges Moustaki a bien été modifié. Vous pourrez renseigner les champs manquants plus tard en cliquant le bouton "Modifier" du patient.',
        );
    });
  });

  describe('Remove', () => {
    it('should remove etudiant with incomplete info and notify user', () => {
      cy.get('[data-test-id="delete-etudiant-button"]:not([disabled])')
        .first()
        .click()
        .wait('@deleteEtudiants');
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
