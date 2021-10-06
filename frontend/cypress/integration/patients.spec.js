const { checkConvention } = require('../../src/services/conventionVerification');
const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');
const { selectValidDateOfBirth, checkIfSelected } = require('./utils/calendar');

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
        .should('have.length', 2);
      cy.get('[data-test-id="etudiant-row-complete-info"]')
        .should('have.length', 3);
      cy.get('[data-test-id="etudiant-table"] td')
        .eq(1)
        .should(
          'have.text',
          'Informations manquantes : nom du docteur, établissement scolaire, adresse du docteur, date de naissance, statut étudiant, orientation médicale',
        );
    });
  });

  describe('Create', () => {
    it('should create an etudiant', () => {
      cy.get('[data-test-id="add-new-etudiant"]')
        .click();

      cy.get('[data-test-id="etudiant-first-name-input"] > input')
        .type('Damir');
      cy.get('[data-test-id="etudiant-last-name-input"] > input')
        .type('Sagadbekov');
      cy.get('[data-test-id="etudiant-doctor-name-input"] > input')
        .type('My doctor');
      cy.get('[data-test-id="add-patient-date-input"]')
        .click();

      selectValidDateOfBirth();

      cy.get('[data-test-id="save-etudiant-button"]')
        .click();

      cy.get('[data-test-id="etudiant-table"] tr')
        .should('have.length', 7);
      cy.get('[data-test-id="etudiant-row-missing-info"]')
        .should('have.length', 3);
      cy.get('[data-test-id="etudiant-row-complete-info"]')
        .should('have.length', 3);

      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          'L\'étudiant Damir Sagadbekov a bien été créé. Vous pourrez renseigner les champs manquants plus tard en cliquant le bouton "Modifier" du patient.',
        );
    });

    it('should not create an etudiant due to invalid date', () => {
      cy.get('[data-test-id="add-new-etudiant"]')
        .click();

      cy.get('[data-test-id="etudiant-first-name-input"] > input')
        .type('Wolve');
      cy.get('[data-test-id="etudiant-last-name-input"] > input')
        .type('Rine');
      cy.get('[data-test-id="etudiant-doctor-name-input"] > input')
        .type('Professeur Xavier');
      cy.get('[data-test-id="add-patient-date-input"]')
        .click();

      checkIfSelected();
    });
  });

  describe('Update', () => {
    it('should update existing etudiant and update completion info', () => {
      cy.get('[data-test-id="update-etudiant-button-large"]')
        .eq(1)
        .click();
      cy.wait('@etudiant');

      cy.get('[data-test-id="etudiant-first-name-input"] > input')
        .clear()
        .type('Georges');
      cy.get('[data-test-id="etudiant-last-name-input"] > input')
        .clear()
        .type('Moustaki');
      cy.get('[data-test-id="etudiant-doctor-name-input"] > input')
        .type('My doctor');
      cy.get('[data-test-id="save-etudiant-button"]')
        .click();

      cy.get('[data-test-id="etudiant-table"] tr')
        .should('have.length', 6);
      cy.get('[data-test-id="etudiant-row-missing-info"]')
        .should('have.length', 1);
      cy.get('[data-test-id="etudiant-row-complete-info"]')
        .should('have.length', 4);

      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          "L'étudiant Georges Moustaki a bien été modifié.",
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
  });
});
