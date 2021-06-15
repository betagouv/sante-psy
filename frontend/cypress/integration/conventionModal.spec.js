const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');
const { removeConvention, signConvention } = require('./utils/psychologist');

const modalShouldExist = exist => {
  cy.visit('/psychologue/nouvelle-seance');
  cy.wait('@config');
  cy.wait('@user');
  cy.get('[data-test-id="convention-modal"]')
    .should(exist ? 'exist' : 'not.exist');
};
describe('ConventionModal', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/config')
      .as('config');
    cy.intercept('GET', '/api/connecteduser')
      .as('user');
    cy.intercept('POST', '/api/psychologue/renseigner-convention')
      .as('updateConvention');

    resetDB();
    loginAsDefault();
  });

  describe('Basic display', () => {
    it('should not display modal convention is signed', () => {
      signConvention('Angers', true).then(() => {
        modalShouldExist(false);
      });
    });

    it('should display modal convention is not signed', () => {
      signConvention('Angers', false).then(() => {
        modalShouldExist(true);
      });
    });

    it('should display modal if no convention', () => {
      removeConvention('login@beta.gouv.fr').then(() => {
        modalShouldExist(true);
      });
    });

    it('should display modal if no convention and not checked since a month', () => {
      const lastCheckDate = new Date();
      lastCheckDate.setMonth(lastCheckDate.getMonth() - 1);
      window.localStorage.setItem('conventionAnswer', lastCheckDate);
      removeConvention('login@beta.gouv.fr').then(() => {
        modalShouldExist(true);
      });
    });

    it('should not display modal if no convention and not checked since less than a month', () => {
      const lastCheckDate = new Date();
      lastCheckDate.setDate(lastCheckDate.getDate() - 15);
      window.localStorage.setItem('conventionAnswer', lastCheckDate);
      removeConvention('login@beta.gouv.fr').then(() => {
        modalShouldExist(false);
      });
    });
  });

  describe('Update', () => {
    beforeEach(() => {
      cy.visit('/psychologue/nouvelle-seance');
      cy.wait('@config');
      cy.wait('@user');
    });

    it('should force user to fill info', () => {
      cy.get('[data-test-id="update-convention-button"]')
        .should('be.disabled');

      cy.get('[data-test-id="convention-university-select"]')
        .select('Aix-Marseille');

      cy.get('[data-test-id="update-convention-button"]')
        .should('be.disabled');

      cy.get('[data-test-id="signed-false"]')
        .click({ force: true });

      cy.get('[data-test-id="update-convention-button"]')
        .should('not.be.disabled');
    });

    it('should update convention and hide info', () => {
      cy.get('[data-test-id="convention-university-select"]')
        .select('Angers');

      cy.get('[data-test-id="signed-false"]')
        .click({ force: true });

      cy.get('[data-test-id="update-convention-button"]')
        .click();

      cy.wait('@updateConvention');

      cy.get('[data-test-id="convention-modal"]')
        .should('not.exist');

      cy.get('[data-test-id="new-appointment-container"]')
        .should('exist');

      cy.get('[data-test-id="notification-success"]')
        .should(
          'have.text',
          'Vos informations de conventionnement sont bien enregistrées.',
        );

      cy.reload();

      cy.get('[data-test-id="convention-modal"]')
        .should('not.exist');

      cy.get('[data-test-id="new-appointment-container"]')
        .should('exist');
    });
  });
});
