const { logout } = require('./utils/login');

describe('Login', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/psychologue/sendMail')
      .as('sendMail');
    cy.intercept('POST', '/api/psychologue/login')
      .as('login');
  });

  it('should send an email and notify the user', () => {
    cy.visit('/psychologue/login');
    cy.get('[data-test-id="email-input"]')
      .type('login@beta.gouv.fr');
    cy.get('[data-test-id="email-button"]')
      .click();
    cy.wait('@sendMail');
    cy.get('[data-test-id="notification-success"]')
      .should(
        'have.text',
        'Un lien de connexion a été envoyé à l\'adresse login@beta.gouv.fr. Le lien est valable une heure.',
      );
  });

  it('should login user when token is entered', () => {
    cy.request('POST', 'http://localhost:8080/api/psychologue/sendMail', { email: 'login@beta.gouv.fr' })
      .then(() => {
        cy.request('http://localhost:8080/test/psychologue/login@beta.gouv.fr')
          .then(response => {
            cy.visit(`/psychologue/login/${response.body.token}`);
            cy.wait('@login');
            cy.location('pathname').should('eq', '/psychologue/mes-seances');
          });
      });
  });

  it('should display an error when invalid token is entered', () => {
    cy.visit('/psychologue/login/nop');
    cy.wait('@login');
    cy.location('pathname').should('not.eq', '/psychologue/mes-seances');
    cy.get('[data-test-id="notification-error"]')
      .should(
        'have.text',
        'Ce lien est invalide ou expiré. Indiquez votre email ci dessous pour en avoir un nouveau.',
      );
  });

  it('should not logged twice with same token', () => {
    cy.request('POST', 'http://localhost:8080/api/psychologue/sendMail', { email: 'login@beta.gouv.fr' })
      .then(() => {
        cy.request('http://localhost:8080/test/psychologue/login@beta.gouv.fr')
          .then(response => {
            cy.visit(`/psychologue/login/${response.body.token}`);
            cy.wait('@login');
            logout();
            cy.visit(`/psychologue/login/${response.body.token}`);
            cy.wait('@login');
            cy.location('pathname').should('not.eq', '/psychologue/mes-seances');
            cy.get('[data-test-id="notification-error"]')
              .should(
                'have.text',
                'Ce lien est invalide ou expiré. Indiquez votre email ci dessous pour en avoir un nouveau.',
              );
          });
      });
  });
});
