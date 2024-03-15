describe('Student eligibility contact', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/eligibilite/contact')
      .as('contact');

    cy.visit('/eligibilite/contact');
  });

  it('should send contact info', () => {
    cy.get('[data-test-id="notification-success"] p')
      .should('not.exist');

    cy.get('[data-test-id="ine-input"]')
      .type('1234567890A');
    cy.get('[data-test-id="formation-input"]')
      .type('technologie et sciences industrielles');
    cy.get('[data-test-id="establishment-input"]')
      .type('Université de Caen');
    cy.get('[data-test-id="email-input"]')
      .type('alphonse.brown@funk.fr');

    cy.get('[data-test-id="eligibility-send-button"]')
      .click();

    cy.get('[data-test-id="notification-success"] p')
      .should(
        'have.text',
        'Votre message a bien été envoyé. Nous reviendrons vers vous rapidement.',
      );
  });
});
