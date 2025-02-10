const { logout, loginAsDefault } = require('./utils/login');

describe('Login', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/psychologist/sendMail')
      .as('sendMail');
    cy.intercept('POST', '/api/psychologist/login')
      .as('login');
    cy.intercept('POST', '/api/psychologist/logout')
      .as('logout');
    cy.intercept('GET', '/api/connecteduser')
      .as('connectedUser');
  });

  describe('Email', () => {
    it('should send an email and notify the user', () => {
      cy.visit('/psychologue/login');
      cy.get('[data-test-id="email-input"]')
        .type('login@beta.gouv.fr');
      cy.get('[data-test-id="email-button"]')
        .click();
      cy.wait('@sendMail');
      cy.get('[data-test-id="notification-success"] p')
        .should(
          'have.text',
          'Un lien de connexion a été envoyé à l\'adresse login@beta.gouv.fr. Le lien est valable 2 heures.',
        );
    });
  });

  describe('Login', () => {
    it('should login user when token is entered', () => {
      cy.request('POST', 'http://localhost:8080/api/psychologist/sendMail', { email: 'login@beta.gouv.fr' })
        .then(() => {
          cy.request('http://localhost:8080/test/psychologist/login@beta.gouv.fr')
            .then(response => {
              cy.visit(`/psychologue/login/${response.body.token}`);
              cy.wait('@login');
              cy.wait('@connectedUser');
              cy.wait('@connectedUser');
              cy.location('pathname').should('eq', '/psychologue/tableau-de-bord');
            });
        });
    });

    it('should display an error when invalid token is entered', () => {
      cy.visit('/psychologue/login/nop');
      cy.wait('@login');
      cy.wait('@connectedUser');
      cy.location('pathname').should('not.eq', '/psychologue/tableau-de-bord');
      cy.get('[data-test-id="notification-error"] p')
        .should(
          'have.text',
          'Ce lien est invalide ou expiré. Indiquez votre email ci dessous pour en avoir un nouveau.',
        );
    });

    it('should not logged twice with same token', () => {
      cy.request('POST', 'http://localhost:8080/api/psychologist/sendMail', { email: 'login@beta.gouv.fr' })
        .then(() => {
          cy.request('http://localhost:8080/test/psychologist/login@beta.gouv.fr')
            .then(response => {
              cy.visit(`/psychologue/login/${response.body.token}`);
              cy.wait('@login');
              cy.wait('@connectedUser');
              cy.wait('@connectedUser');
              cy.get('[data-test-id="dashboard"]').should('be.visible');
              logout();
              cy.visit(`/psychologue/login/${response.body.token}`);
              cy.wait('@login');
              cy.wait('@connectedUser');
              cy.location('pathname').should('not.eq', '/psychologue/tableau-de-bord');
              cy.get('[data-test-id="notification-error"] p')
                .should(
                  'have.text',
                  'Ce lien est invalide ou expiré. Indiquez votre email ci dessous pour en avoir un nouveau.',
                );
            });
        });
    });
  });

  describe('Login expiration', () => {
    it('Should redirect to login page after expiration', () => {
      loginAsDefault('2s');
      cy.visit('/psychologue/login');
      cy.location('pathname').should('eq', '/psychologue/tableau-de-bord');

      // We explicitely wait for token to expire
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);

      cy.reload();
      cy.location('pathname').should('eq', '/psychologue/login');
    });
  });

  describe('Logout', () => {
    it('should redirect to home page after login in', () => {
      loginAsDefault();
      cy.visit('/psychologue/tableau-de-bord');

      logout();
      cy.wait('@logout');

      cy.location('pathname').should('eq', '/');
    });
  });
});
