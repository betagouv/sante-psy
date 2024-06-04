const { checkConvention } = require('../../src/services/conventionVerification');
const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');
const { removeConvention, signConvention } = require('./utils/psychologist');

describe('Convention', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/psychologist/*').as('getProfile');
    cy.intercept('GET', '/api/config').as('config');
    cy.intercept('POST', '/api/psychologist/*/convention').as(
      'updateConvention',
    );

    resetDB();
    loginAsDefault();
    checkConvention();

    cy.visit('/psychologue/tableau-de-bord');
    cy.wait('@config');
    cy.wait('@getProfile');
  });

  describe('Convention is not signed yet', () => {
    it('should display unsigned convention status ', () => {
      cy.get('[data-test-id="show-convention-form"]').should('exist');
      cy.get('[data-test-id="show-convention-form"]').should('not.be.disabled');
      cy.get('[data-test-id="show-convention-form"] p').should('contain.text', 'Pas encore signée');
    });

    it('should be able to click on convention status to access form', () => {
      cy.get('[data-test-id="show-convention-form"]').should('exist');
      cy.get('[data-test-id="show-convention-form"]').should('not.be.disabled');
      cy.get('[data-test-id="show-convention-form"]').click();
    });

    it('should update existing convention info ', () => {
      cy.get('[data-test-id="show-convention-form"]')
        .click();
      cy.get('[data-test-id="convention-form"]')
        .should('exist');
      cy.get('[data-test-id="convention-form-title"]')
        .should('exist');
      cy.get('[data-test-id="convention-university-name"]')
        .should('contain.text', "Vous êtes rattaché à l'université de Strasbourg (UNISTRA).");
      cy.get('[data-test-id="signed-true"]')
        .click();
      cy.get('[data-test-id="update-convention-button"]')
        .click();
      cy.wait('@updateConvention');
      cy.get('[data-test-id="show-convention-form"] p').should('contain.text', 'Convention : Signée');
      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          'Vos informations de conventionnement sont bien enregistrées.',
        );
    });

    it('should create convention', () => {
      removeConvention('login@beta.gouv.fr');
      cy.reload();
      cy.get('[data-test-id="show-convention-form"]')
        .click();
      cy.get('[data-test-id="signed-false"]')
        .click();
      cy.get('[data-test-id="update-convention-button"]')
        .click();
      cy.wait('@updateConvention');
      cy.get('[data-test-id="show-convention-form"] p')
        .should('contain.text', 'Pas encore signée');
      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          'Vos informations de conventionnement sont bien enregistrées.',
        );
    });
  });

  describe('If convention is signed', () => {
    it('should display signed convention status ', () => {
      signConvention(true);
      cy.reload();
      cy.get('[data-test-id="show-convention-form"]').should('exist');
      cy.get('[data-test-id="show-convention-form"] p').should('contain.text', 'Convention : Signée');
    });
  });
});
