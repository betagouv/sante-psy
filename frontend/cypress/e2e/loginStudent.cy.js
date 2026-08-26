const { loginDefaultStudent } = require('./utils/login');

describe('Login Student', () => {
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
        .type('student@beta.gouv.fr');
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
    it('should display an error when invalid token is entered', () => {
      cy.visit('/login/nop');
      loginDefaultStudent();
      cy.location('pathname').should('eq', '/login/nop');
      cy.get('[data-test-id="notification-error"] p')
        .should(
          'have.text',
          'Ce lien est invalide ou expiré. Indiquez votre email ci-dessous pour en avoir un nouveau.',
        );
    });
  });
});
