const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');
const { removeConvention } = require('./utils/psychologist');

describe('Reimbursement', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/psychologue/mes-remboursements')
      .as('reimbursement');
    cy.intercept('POST', '/api/psychologue/renseigner-convention')
      .as('updateConvention');
    cy.intercept('GET', '/api/config')
      .as('config');

    resetDB();
    loginAsDefault();

    cy.visit('/psychologue/mes-remboursements');
    cy.wait('@config');
    cy.wait('@reimbursement');
  });

  describe('Display convention', () => {
    it('should display convention info in non edition mode when existing', () => {
      cy.get('[data-test-id="convention-form"]')
        .should('not.exist');
      cy.get('[data-test-id="convention-university-name"]')
        .should('have.text', 'Je suis rattaché à l‘université de Strasbourg (UNISTRA).');
      cy.get('[data-test-id="convention-signed"]')
        .should('have.text', 'La convention n‘est pas encore signée.');
    });

    it('should display convention form when not existing', () => {
      removeConvention('login@beta.gouv.fr');
      cy.reload();
      cy.get('[data-test-id="convention-form"]')
        .should('exist');
      cy.get('[data-test-id="convention-university-name"]')
        .should('not.exist');
      cy.get('[data-test-id="convention-signed"]')
        .should('not.exist');
    });
  });

  describe('Update convention', () => {
    it('should udpate existing convention info ', () => {
      cy.get('[data-test-id="show-convention-form"]')
        .click();
      cy.get('[data-test-id="convention-form"]')
        .should('exist');
      cy.get('[data-test-id="convention-form-title"]')
        .should('exist');
      cy.get('[data-test-id="convention-university-select"]')
        .select('Angers');
      cy.get('[data-test-id="convention-signed-input"]')
        .click({ force: true });
      cy.get('[data-test-id="update-convention-button"]')
        .click();
      cy.wait('@updateConvention');
      cy.wait('@reimbursement');
      cy.get('[data-test-id="convention-form"]')
        .should('not.exist');
      cy.get('[data-test-id="convention-university-name"]')
        .should('have.text', 'Je suis rattaché à l‘université de Angers.');
      cy.get('[data-test-id="convention-signed"]')
        .should('have.text', 'La convention est signée.');
      cy.get('[data-test-id="notification-success"]')
        .should(
          'have.text',
          'Vos informations de conventionnement sont bien enregistrées.',
        );
    });

    it('should create convention', () => {
      removeConvention('login@beta.gouv.fr');
      cy.reload();
      cy.get('[data-test-id="convention-form"]')
        .should('exist');
      cy.get('[data-test-id="convention-form-title"]')
        .should('not.exist');
      cy.get('[data-test-id="convention-university-select"]')
        .select('Aix-Marseille');
      cy.get('[data-test-id="convention-unsigned-input"]')
        .click({ force: true });
      cy.get('[data-test-id="update-convention-button"]')
        .click();
      cy.wait('@updateConvention');
      cy.wait('@reimbursement');
      cy.get('[data-test-id="convention-form"]')
        .should('not.exist');
      cy.get('[data-test-id="convention-university-name"]')
        .should('have.text', 'Je suis rattaché à l‘université de Aix-Marseille.');
      cy.get('[data-test-id="convention-signed"]')
        .should('have.text', 'La convention n‘est pas encore signée.');
      cy.get('[data-test-id="notification-success"]')
        .should(
          'have.text',
          'Vos informations de conventionnement sont bien enregistrées.',
        );
    });
  });

  describe('Display reimbursements', () => {
    it('should display reimbursements', () => {
      cy.get('[data-test-id="billing-row"]')
        .should('have.length', 6);
    });
  });
});
