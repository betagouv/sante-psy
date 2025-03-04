const { loginAsDefault } = require('./utils/login');

describe('Contact', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/contact/form')
      .as('contact');

    cy.visit('/contact/form');
  });

  it('should send contact info', () => {
    cy.get('[data-test-id="notification-success"] p')
      .should('not.exist');

    cy.get('[data-test-id="user-student-input"]')
      .click();
    cy.get('[data-test-id="name-input"]')
      .type('Brown');
    cy.get('[data-test-id="first-name-input"]')
      .type('Alphonse');
    cy.get('[data-test-id="email-input"]')
      .type('alphonse.brown@funk.fr');
    cy.get('[data-test-id="reason-select"] > select > option')
      .eq(1)
      .then(element => cy.get('[data-test-id="reason-select"] > select').select(element.val()));
    cy.get('[data-test-id="message-input"]')
      .type('La puissance du port du havre');

    cy.get('[data-test-id="submit-button"]')
      .click();

    cy.get('[data-test-id="notification-success"] p')
      .should(
        'have.text',
        'Votre message a bien été envoyé. Nous reviendrons vers vous rapidement.',
      );
  });

  it('should default psychologist if connected', () => {
    cy.get('[data-test-id="user-psychologist-input"] input')
      .should('not.be.checked');

    loginAsDefault();
    cy.reload();

    cy.get('[data-test-id="user-psychologist-input"] input')
      .should('be.checked');
  });
});
