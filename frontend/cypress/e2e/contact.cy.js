describe('Contact', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/contact').as('contact');

    cy.visit('/contact/formulaire');
  });

  it('should send contact info', () => {
    cy.get(
      '[data-test-id="notification-success"] .notification-description',
    ).should('not.exist');

    cy.get('[data-test-id="user-student-input"]').check({ force: true });
    cy.get('[data-test-id="name-input"]').type('Brown');
    cy.get('[data-test-id="first-name-input"]').type('Alphonse');
    cy.get('[data-test-id="email-input"]').type('alphonse.brown@funk.fr');
    cy.get('[data-test-id="reason-select"] > option')
      .eq(1)
      .then((element) =>
        cy.get('[data-test-id="reason-select"]').select(element.val()),
      );
    cy.get('[data-test-id="message-input"]').type(
      'La puissance du port du havre',
    );

    cy.get('[data-test-id="submit-button"]').click();
  });
});
