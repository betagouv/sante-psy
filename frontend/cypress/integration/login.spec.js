const { logout, loginAsDefault } = require('./utils/login');

describe('Login', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/psychologue/sendMail')
      .as('sendMail');
    cy.intercept('POST', '/api/psychologue/login')
      .as('login');
  });

  describe('Email', () => {
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
          'Un lien de connexion a été envoyé à l\'adresse login@beta.gouv.fr. Le lien est valable 2 heures.',
        );
    });
  });

  describe('Login', () => {
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

  describe('Login expiration', () => {
    it('Should redirect to login page after expiration', () => {
      loginAsDefault(2);
      cy.visit('/psychologue/login');
      cy.location('pathname').should('eq', '/psychologue/mes-seances');

      // We explicitely wait for token to expire
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(2000);

      cy.reload();
      cy.location('pathname').should('eq', '/psychologue/login');
      cy.get('[data-test-id="notification-error"]')
        .should(
          'have.text',
          'Votre session a expiré, veuillez vous reconnecter.',
        );
    });

    it('Should display error message on token expiration', () => {
      loginAsDefault(1);
      // We explicitely wait for token to expire
      // eslint-disable-next-line cypress/no-unnecessary-waiting
      cy.wait(1000);

      cy.visit('/psychologue/login');
      cy.location('pathname').should('eq', '/psychologue/login');
      // message is displayed
      cy.get('[data-test-id="notification-error"]')
        .should(
          'have.text',
          'Votre session a expiré, veuillez vous reconnecter.',
        );
      cy.reload();
      // message is displayed on reload
      cy.get('[data-test-id="notification-error"]')
        .should(
          'have.text',
          'Votre session a expiré, veuillez vous reconnecter.',
        );
      cy.get('[data-test-id="notification-close"]')
        .click();
      // message disappear on close
      cy.get('[data-test-id="notification-error"]')
        .should('not.exist');
      cy.reload();
      // message is never shown after on close
      cy.get('[data-test-id="notification-error"]')
        .should('not.exist');
    });
  });
});
