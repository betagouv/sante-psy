const { checkConvention } = require('../../src/services/conventionVerification');
const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');

describe('Reimbursement', () => {
  const currentYear = new Date().getFullYear();

  beforeEach(() => {
    cy.clock(new Date(currentYear, 0, 1).getTime());

    cy.intercept({
      method: 'GET',
      pathname: '/api/appointments',
      query: {
        month: '1',
        year: currentYear.toString(),
        isBillingPurposes: 'true',
      },
    }).as('appointments');
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
        .contains('vous avez effectué 13 séances, dont 0 premières séances, auprès de 3 étudiants');

      cy.get('[data-test-id="billing-table"] tr')
        .should('have.length', 8);

      cy.get('[data-test-id="billing-table"] td')
        .eq(1).should('have.text', '1');
      cy.get('[data-test-id="billing-table"] td')
        .eq(2).should('have.text', '0');
      cy.get('[data-test-id="billing-table"] td')
        .eq(3).should('have.text', '50€');
      cy.get('[data-test-id="billing-table"] td')
        .eq(13).should('have.text', '2');
      cy.get('[data-test-id="billing-table"] td')
        .eq(14).should('have.text', '0');
      cy.get('[data-test-id="billing-table"] td')
        .eq(15).should('have.text', '100€');
      cy.get('[data-test-id="billing-table"] td')
        .eq(17).should('have.text', '3');
      cy.get('[data-test-id="billing-table"] td')
        .eq(18).should('have.text', '0');
      cy.get('[data-test-id="billing-table"] td')
        .eq(19).should('have.text', '150€');
      cy.get('[data-test-id="billing-table"] td')
        .eq(27).should('have.text', '650€');
    });
  });
});
