const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');
const { signConvention } = require('./utils/psychologist');

describe('Header Test', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/config')
      .as('config');
    cy.intercept('GET', '/api/connecteduser')
      .as('connectedUser');
    cy.intercept('GET', '/api/statistics')
      .as('statistics');
  });

  describe('User NOT connected', () => {
    describe('On desktop', () => {
      beforeEach(() => {
        cy.visit('/');
        cy.wait('@config');
        cy.wait('@connectedUser');
        cy.wait('@statistics');
      });

      it('should display login button', () => {
        cy.get('[data-test-id="login-button"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/psychologue/login');
      });

      it('should display default header nav', () => {
        cy.get('[data-test-id="header-default-link-2"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/trouver-un-psychologue');
      });

      it('should NOT display logout button', () => {
        cy.get('[data-test-id="logout-button"]').should('not.exist');
      });

      it('should NOT display connected header nav', () => {
        cy.get('[data-test-id="header-connected-link-2"]').should('not.exist');
      });
    });

    describe('On mobile', () => {
      beforeEach(() => {
        cy.viewport('iphone-6');

        cy.visit('/');
        cy.wait('@config');
        cy.wait('@connectedUser');
        cy.wait('@statistics');
      });

      it('should display login button', () => {
        cy.get('[data-test-id="login-button"]').should('not.be.visible');
        cy.get('[aria-label="ouvrir la navigation"]').as('burger-menu');
        cy.get('@burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="login-button"]').should('be.visible').click();
        });
        cy.location('pathname').should('eq', '/psychologue/login');
      });

      it('should display default header nav', () => {
        cy.get('[data-test-id="header-default-link-2"]').should('not.be.visible');
        cy.get('[aria-label="ouvrir la navigation"]').as('burger-menu');
        cy.get('@burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="header-default-link-2"]').should('be.visible').click();
        });
        cy.location('pathname').should('eq', '/trouver-un-psychologue');
      });

      it('should NOT display logout button', () => {
        cy.get('[aria-label="ouvrir la navigation"]').as('burger-menu');
        cy.get('@burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="logout-button"]').should('not.exist');
        });
      });

      it('should NOT display connected header nav', () => {
        cy.get('[aria-label="ouvrir la navigation"]').as('burger-menu');
        cy.get('@burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="header-connected-link-2"]').should('not.exist');
        });
      });
    });
  });

  describe('User connected', () => {
    beforeEach(() => {
      cy.intercept('GET', '/api/appointments')
        .as('appointments');
      cy.intercept('POST', '/api/psychologist/logout')
        .as('logout');

      resetDB();
      loginAsDefault();
      signConvention('Angers', true);
    });

    describe('On desktop', () => {
      beforeEach(() => {
        cy.visit('/psychologue/mes-seances');
        cy.wait('@config');
        cy.wait('@appointments');
      });

      it('should display logout button', () => {
        cy.get('[data-test-id="logout-button"]').should('be.visible').click();
        cy.wait('@logout');
        cy.location('pathname').should('eq', '/psychologue/login');
      });

      it('should display connected header nav', () => {
        cy.get('[data-test-id="header-connected-link-2"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/psychologue/mes-patients');
      });

      it('should NOT display login button', () => {
        cy.get('[data-test-id="login-button"]').should('not.exist');
      });

      it('should NOT display default header nav', () => {
        cy.get('[data-test-id="header-default-link-2"]').should('not.exist');
      });
    });

    describe('On mobile', () => {
      beforeEach(() => {
        cy.viewport('iphone-6');

        cy.visit('/psychologue/mes-seances');
        cy.wait('@config');
        cy.wait('@appointments');
      });

      it('should display logout button', () => {
        cy.viewport('iphone-6');

        cy.get('[data-test-id="logout-button"]').should('not.be.visible');
        cy.get('[aria-label="ouvrir la navigation"]').as('burger-menu');
        cy.get('@burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="logout-button"]').should('be.visible').click();
        });
        cy.wait('@logout');
        cy.location('pathname').should('eq', '/psychologue/login');
      });

      it('should display connected header nav', () => {
        cy.viewport('iphone-6');

        cy.get('[data-test-id="header-connected-link-2"]').should('not.be.visible');
        cy.get('[aria-label="ouvrir la navigation"]').as('burger-menu');
        cy.get('@burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="header-connected-link-2"]').should('be.visible').click();
        });
        cy.location('pathname').should('eq', '/psychologue/mes-patients');
      });

      it('should NOT display login button', () => {
        cy.get('[aria-label="ouvrir la navigation"]').as('burger-menu');
        cy.get('@burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="login-button"]').should('not.exist');
        });
      });

      it('should NOT display default header nav', () => {
        cy.get('[aria-label="ouvrir la navigation"]').as('burger-menu');
        cy.get('@burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="header-default-link-2"]').should('not.exist');
        });
      });
    });
  });
});
