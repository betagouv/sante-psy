const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');
const { signConvention } = require('./utils/psychologist');

describe('Header Test', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/config').as('config');
    cy.intercept('GET', '/api/connecteduser').as('connectedUser');
    cy.intercept('GET', '/api/statistics').as('statistics');
  });

  describe('User NOT connected', () => {
    describe('On desktop', () => {
      beforeEach(() => {
        cy.visit('/');
        cy.wait('@config');
        cy.wait('@connectedUser');
        cy.wait('@statistics');
      });

      it('should display correct tool items', () => {
        // Connected actions are not present
        cy.get('[data-test-id="logout-link"]').should('not.exist');
        cy.get('[data-test-id="back-home-button"]').should('not.exist');
        cy.get('[data-test-id="my-space-button"]').should('not.exist');

        // Public action is visible and works
        cy.get('[data-test-id="login-button"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/login');
      });

      it('should display correct nav items', () => {
        // Connected nav is not present
        cy.get('[data-test-id="Tableau de bord"]').should('not.exist');
        cy.get('[data-test-id="Déclarer mes séances"]').should('not.exist');
        cy.get('[data-test-id="Suivi étudiants"]').should('not.exist');
        cy.get('[data-test-id="Facturation"]').should('not.exist');

        // Public nav is visible and works

        cy.get('[data-test-id="Foire aux questions"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/faq');

        cy.get('[data-test-id="Comment ça marche ?"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/');
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

      it('should display correct tool items', () => {
        // Public action is not visible
        cy.get('[data-test-id="login-button"]').should('not.be.visible');

        cy.get('[aria-label="ouvrir la navigation"]').as('open-burger-menu');
        cy.get('[aria-label="fermer la navigation"]').as('close-burger-menu');

        // Open burger menu
        cy.get('@open-burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('@close-burger-menu').should('be.visible');

          // Connected actions are not present
          cy.get('[data-test-id="logout-link"]').should('not.exist');
          cy.get('[data-test-id="back-home-button"]').should('not.exist');
          cy.get('[data-test-id="my-space-button"]').should('not.exist');

          // Public action is visible and works
          cy.get('[data-test-id="login-button"]').should('be.visible').click();
          cy.location('pathname').should('eq', 'w/login');
        });
      });

      it('should display correct nav items', () => {
        // Public nav items not visible
        cy.get('[data-test-id="Comment ça marche ?"]').should('not.be.visible');
        cy.get('[data-test-id="Foire aux questions"]').should('not.be.visible');

        cy.get('[aria-label="ouvrir la navigation"]').as('open-burger-menu');
        cy.get('[aria-label="fermer la navigation"]').as('close-burger-menu');

        // Open burger menu
        cy.get('@open-burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('@close-burger-menu').should('be.visible');

          // Connected nav is not present
          cy.get('[data-test-id="Tableau de bord"]').should('not.exist');
          cy.get('[data-test-id="Déclarer mes séances"]').should('not.exist');
          cy.get('[data-test-id="Suivi étudiants"]').should('not.exist');
          cy.get('[data-test-id="Facturation"]').should('not.exist');

          // Public nav is visible and works
          cy.get('[data-test-id="Foire aux questions"]').should('be.visible').click();
          cy.location('pathname').should('eq', '/faq');
        });

        cy.get('@open-burger-menu').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="Foire aux questions"]').should('be.visible').click();
          cy.location('pathname').should('eq', '/faq');
        });

        cy.get('@open-burger-menu').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="Comment ça marche ?"]').should('be.visible').click();
          cy.location('pathname').should('eq', '/');
        });
      });
    });
  });

  describe('User connected', () => {
    beforeEach(() => {
      cy.intercept({
        method: 'GET',
        pathname: '/api/appointments',
      }).as('appointments');
      cy.intercept('POST', '/api/psychologist/logout').as('logout');

      resetDB();
      loginAsDefault().then(() => signConvention(true));
    });

    describe('On desktop', () => {
      beforeEach(() => {
        cy.visit('/psychologue/mes-seances');
        cy.wait('@config');
        cy.wait('@appointments');
      });

      it('should display correct tool items', () => {
        // Public action is not present
        cy.get('[data-test-id="login-button"]').should('not.exist');

        // We are on psy space => back home button is visible and works
        cy.get('[data-test-id="my-space-button"]').should('not.exist');
        cy.get('[data-test-id="back-home-button"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/');

        // We are on public space => my space button is visible and works
        cy.get('[data-test-id="back-home-button"]').should('not.exist');
        cy.get('[data-test-id="my-space-button"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/psychologue/tableau-de-bord');

        // Logout
        cy.get('[data-test-id="logout-link"]').should('be.visible').click();
        cy.wait('@logout');
        cy.location('pathname').should('eq', '/');
      });

      it('should display correct nav items', () => {
        // Public nav is not present
        cy.get('[data-test-id="Comment ça marche ?"]').should('not.exist');
        cy.get('[data-test-id="Foire aux questions"]').should('not.exist');

        // Connected nav is visible and works
        cy.get('[data-test-id="Suivi étudiants"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/psychologue/mes-etudiants');

        cy.get('[data-test-id="Facturation"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/psychologue/mes-remboursements');

        cy.get('[data-test-id="Tableau de bord"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/psychologue/tableau-de-bord');

        cy.get('[data-test-id="Déclarer mes séances"]').should('be.visible').click();
        cy.location('pathname').should('eq', '/psychologue/mes-seances');
      });
    });

    describe('On mobile', () => {
      beforeEach(() => {
        cy.viewport('iphone-6');

        cy.visit('/psychologue/mes-seances');
        cy.wait('@config');
        cy.wait('@appointments');
      });

      it('should display correct tool items', () => {
        // Connected actions are not visible
        cy.get('[data-test-id="logout-link"]').should('not.be.visible');

        cy.get('[aria-label="ouvrir la navigation"]').as('open-burger-menu');
        cy.get('[aria-label="fermer la navigation"]').as('close-burger-menu');

        // Open burger menu
        cy.get('@open-burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('@close-burger-menu').should('be.visible');

          // Public action is not present
          cy.get('[data-test-id="login-button"]').should('not.exist');

          // We are on psy space => back home button is visible and works
          cy.get('[data-test-id="my-space-button"]').should('not.exist');
          cy.get('[data-test-id="back-home-button"]').should('be.visible').click();
          cy.location('pathname').should('eq', '/');
          cy.get('@close-burger-menu').should('not.be.visible');
        });

        cy.get('@open-burger-menu').click();
        cy.get('.fr-modal--opened').within(() => {
          // We are on public space => my space button is visible and works
          cy.get('[data-test-id="back-home-button"]').should('not.exist');
          cy.get('[data-test-id="my-space-button"]').should('be.visible').click();
          cy.location('pathname').should('eq', '/psychologue/tableau-de-bord');
          cy.get('@close-burger-menu').should('not.be.visible');
        });

        cy.get('@open-burger-menu').click();
        cy.get('.fr-modal--opened').within(() => {
          // Logout
          cy.get('[data-test-id="logout-link"]').should('be.visible').click();
          cy.wait('@logout');
          cy.location('pathname').should('eq', '/');
          cy.get('@close-burger-menu').should('not.be.visible');
        });
      });

      it('should display correct nav items', () => {
        // Connected actions are not visible
        cy.get('[data-test-id="Suivi étudiants"]').should('not.be.visible');

        cy.get('[aria-label="ouvrir la navigation"]').as('open-burger-menu');
        cy.get('[aria-label="fermer la navigation"]').as('close-burger-menu');

        // Open burger menu
        cy.get('@open-burger-menu').should('be.visible').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('@close-burger-menu').should('be.visible');

          // Public nav is not present
          cy.get('[data-test-id="Comment ça marche ?"]').should('not.exist');
          cy.get('[data-test-id="Foire aux questions"]').should('not.exist');

          // Connected nav is visible and works
          cy.get('[data-test-id="Suivi étudiants"]').should('be.visible').click();
          cy.location('pathname').should('eq', '/psychologue/mes-etudiants');
        });

        cy.get('@open-burger-menu').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="Facturation"]').should('be.visible').click();
          cy.location('pathname').should('eq', '/psychologue/mes-remboursements');
        });

        cy.get('@open-burger-menu').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="Tableau de bord"]').should('be.visible').click();
          cy.location('pathname').should('eq', '/psychologue/tableau-de-bord');
        });

        cy.get('@open-burger-menu').click();
        cy.get('.fr-modal--opened').within(() => {
          cy.get('[data-test-id="Déclarer mes séances"]').should('be.visible').click();
          cy.location('pathname').should('eq', '/psychologue/mes-seances');
        });
      });
    });
  });
});
