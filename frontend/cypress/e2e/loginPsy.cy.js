const { logout, loginDefaultPsy } = require('./utils/login');

describe('Login Psy', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/auth/sendLoginMail')
      .as('sendMail');
    cy.intercept('POST', '/api/auth/login')
      .as('login');
    cy.intercept('POST', '/api/logout')
      .as('logout');
    cy.intercept('GET', '/api/auth/connected')
      .as('connectedUser');
  });

  describe('Email', () => {
    it('should send an email and notify the user', () => {
      cy.visit('/login');
      cy.get('[data-test-id="email-input"]')
        .type('login@beta.gouv.fr');
      cy.get('[data-test-id="email-button"]')
        .click();
      cy.wait('@sendMail');
      cy.get('[data-test-id="notification-success"] p')
        .invoke('text')
        .then(text => text.replace(/\s+/g, ' ').trim())
        .should(
          'eq',
          'Un email de connexion vient de vous être envoyé si votre adresse email correspond bien à un utilisateur inscrit sur Santé Psy Étudiant. Le lien est valable 2 heures.',
        );
    });
  });

  describe('Login', () => {
    it('should login user when token is entered', () => {
      loginDefaultPsy();
      cy.visit('/psychologue/tableau-de-bord');
      cy.wait('@connectedUser');
      cy.location('pathname').should('eq', '/psychologue/tableau-de-bord');
    });

    it('should display an error when invalid token is entered', () => {
      cy.visit('/login/nop');
      loginDefaultPsy();
      cy.location('pathname').should('eq', '/login/nop');
      cy.get('[data-test-id="notification-error"] p')
        .should(
          'have.text',
          'Ce lien est invalide ou expiré. Indiquez votre email ci-dessous pour en avoir un nouveau.',
        );
    });

    // TODO : should be tested in unit test
    it('should not logged twice with same token', () => {
      cy.request('http://localhost:8080/test/auth/psychologist/login@beta.gouv.fr')
        .then(response => {
          cy.visit(`/login/${response.body.token}`);
          cy.wait('@login');
          cy.wait('@connectedUser');
          cy.wait('@connectedUser');
          cy.get('[data-test-id="dashboard"]').should('be.visible');
          logout();
          cy.visit(`/login/${response.body.token}`);
          cy.wait('@login');
          cy.wait('@connectedUser');
          cy.location('pathname').should('not.eq', '/psychologue/tableau-de-bord');
          cy.get('[data-test-id="notification-error"] p')
            .should(
              'have.text',
              'Ce lien est invalide ou expiré. Indiquez votre email ci-dessous pour en avoir un nouveau.',
            );
        });
    });
  });

  describe('Login expiration', () => {
    it('Should redirect to login page after expiration', () => {
      loginDefaultPsy('3s');
      cy.visit('/psychologue');
      cy.location('pathname').should('eq', '/psychologue/tableau-de-bord');
      cy.wait('@connectedUser');

      // We explicitely wait for token to expire
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(3000);

      cy.reload();
      cy.location('pathname').should('eq', '/login');
    });
  });

  describe('Logout', () => {
    it('should redirect to home page after login out', () => {
      loginDefaultPsy();
      cy.visit('/psychologue/tableau-de-bord');

      logout();
      cy.wait('@logout');

      cy.location('pathname').should('eq', '/');
    });
  });
});
