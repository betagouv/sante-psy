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
      cy.get('[data-test-id="etudiant-gender-female-input"]')
        .click();
      cy.get('[data-test-id="etudiant-school-input"] > input')
        .type('Université de Rennes');
      cy.get('[data-test-id="etudiant-ine-input"] > input')
        .type('010203045LL');
      cy.get('[data-test-id="etudiant-status-input"]')
        .click();
      cy.get('[data-test-id="etudiant-doctor-name-input"] > input')
        .type('Dr Dupont');
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
      cy.contains('[data-test-id="etudiant-name"]', 'LAURE')
        .parents('tr')
        .find('[data-test-id="update-etudiant-button"]')
        .click();

      cy.wait('@etudiant');
      // we set this date to always have the same active tab in student profile
      const currentYear = new Date().getFullYear();
      cy.clock(new Date(currentYear, 5, 1).getTime());
      cy.get('[data-test-id="etudiant-seances-list"]').should('exist');
      cy.get('[data-test-id="etudiant-seances-list"] tr')
        .should('have.length', 49);
      cy.get('[data-test-id="etudiant-seances-list"] ul li button')
        .eq(0).click();
      cy.get('[data-test-id="etudiant-seances-list"] tr')
        .should('have.length', 49);

      cy.get('[data-test-id="etudiant-first-name-input"] > input').clear();
      cy.get('[data-test-id="etudiant-first-name-input"] > input').type('Georges');
      cy.get('[data-test-id="etudiant-last-name-input"] > input').clear();
      cy.get('[data-test-id="etudiant-last-name-input"] > input').type('Moustaki');
      cy.get('[data-test-id="etudiant-ine-input"] > input').clear();
      cy.get('[data-test-id="etudiant-ine-input"] > input').type('010203045ML');

      cy.get('[data-test-id="etudiant-doctor-name-input"] > input')
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
