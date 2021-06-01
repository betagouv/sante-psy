const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');

describe('Profile', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/psychologue/*')
      .as('getProfile');
    cy.intercept('PUT', '/api/psychologue/*')
      .as('updateProfile');
    cy.intercept('GET', '/api/config')
      .as('config');

    resetDB();
    loginAsDefault();

    cy.visit('/psychologue/mon-profil');
    cy.wait('@config');
    cy.wait('@getProfile');
  });

  describe('Display profile', () => {
    it('should display profile in non edition mode when existing', () => {
      cy.get('[data-test-id="edit-profile-form"]')
        .should('not.exist');
      cy.get('[data-test-id="personal-email-info"]')
        .should('have.text', 'Email personnel : login@beta.gouv.fr');
    });
  });

  describe('Update profile', () => {
    it('should udpate existing profile', () => {
      cy.get('[data-test-id="show-profile-form-button"]')
        .click();
      cy.get('[data-test-id="edit-profile-form"]')
        .should('exist');
      cy.get('[data-test-id="psy-personal-email-input"]')
        .clear()
        .type('new@beta.gouv.fr');
      cy.get('[data-test-id="save-profile-button"]')
        .click();
      cy.wait('@updateProfile');
      cy.get('[data-test-id="edit-profile-form"]')
        .should('not.exist');
      cy.get('[data-test-id="personal-email-info"]')
        .should('have.text', 'Email personnel : new@beta.gouv.fr');
      cy.get('[data-test-id="notification-success"]')
        .should(
          'have.text',
          'Vos informations ont bien été mises à jour.',
        );
    });
  });
});
