const { checkConvention } = require('../../src/services/conventionVerification');
const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');

describe('Reimbursement', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/appointments')
      .as('appointments');
    cy.intercept('GET', '/api/config')
      .as('config');

    resetDB();
    loginAsDefault();
    checkConvention();

    cy.visit('/psychologue/mes-remboursements');
    cy.wait('@config');
    cy.wait('@appointments');
  });

  describe('Display reimbursements', () => {
    it('should display reimbursements', () => {
      cy.get('[data-test-id="bill-summary-text"]')
        .contains('vous avez effectué 13 séances auprès de 3 étudiants');

      cy.get('[data-test-id="billing-table"] tr')
        .should('have.length', 8);

      cy.get('[data-test-id="billing-table"] td')
        .eq(1).should('have.text', '1');
      cy.get('[data-test-id="billing-table"] td')
        .eq(2).should('have.text', '30€');
      cy.get('[data-test-id="billing-table"] td')
        .eq(13).should('have.text', '3');
      cy.get('[data-test-id="billing-table"] td')
        .eq(14).should('have.text', '90€');
      cy.get('[data-test-id="billing-table"] td')
        .eq(19).should('have.text', '13');
      cy.get('[data-test-id="billing-table"] td')
        .eq(20).should('have.text', '390€');
    });
  });
});
