const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');
const { suspend } = require('./utils/psychologist');

describe('Profile', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/psychologue/*/suspend')
      .as('suspend');
    cy.intercept('POST', '/api/psychologue/*/activate')
      .as('activate');
    cy.intercept('GET', '/api/psychologue/*')
      .as('getProfile');
    cy.intercept('PUT', '/api/psychologue/*')
      .as('updateProfile');
    cy.intercept('GET', '/api/config')
      .as('config');

    resetDB();
    loginAsDefault();

    cy.visit('/psychologue/mon-profil');
    cy.wait('@config');
    cy.wait('@getProfile');
  });

  describe('Display profile', () => {
    it('should display profile in non edition mode when existing', () => {
      cy.get('[data-test-id="edit-profile-form"]')
        .should('not.exist');
      cy.get('[data-test-id="personal-email-info"]')
        .should('have.text', 'Email personnel : login@beta.gouv.fr');
    });
  });

  describe('Update profile', () => {
    it('should udpate existing profile', () => {
      cy.get('[data-test-id="show-profile-form-button"]')
        .click();
      cy.get('[data-test-id="edit-profile-form"]')
        .should('exist');
      cy.get('[data-test-id="psy-personal-email-input"]')
        .clear()
        .type('new@beta.gouv.fr');
      cy.get('[data-test-id="save-profile-button"]')
        .click();
      cy.wait('@updateProfile');
      cy.get('[data-test-id="edit-profile-form"]')
        .should('not.exist');
      cy.get('[data-test-id="personal-email-info"]')
        .should('have.text', 'Email personnel : new@beta.gouv.fr');
      cy.get('[data-test-id="notification-success"]')
        .should(
          'have.text',
          'Vos informations ont bien été mises à jour.',
        );
    });
  });

  describe('Reactivate profile', () => {
    it('should reactivate profile when asked', () => {
      suspend()
        .then(() => {
          cy.reload();
          cy.get('[data-test-id="activate-button"]')
            .click();

          cy.wait('@activate');

          cy.get('[data-test-id="activePsy"]')
            .should('have.text', 'Vos informations sont visibles sur l‘annuaire.');
          cy.get('[data-test-id="inactivePsy"]')
            .should('not.exist');
          cy.get('[data-test-id="notification-success"]')
            .should(
              'have.text',
              'Vos informations sont de nouveau visibles sur l\'annuaire.',
            );
        });
    });
  });

  describe('Suspend profile', () => {
    it('should say that your profile is suspended', () => {
      cy.get('[data-test-id="activePsy"]')
        .should('have.text', 'Vos informations sont visibles sur l‘annuaire.');
      cy.get('[data-test-id="inactivePsy"]')
        .should('not.exist');

      suspend().then(() => {
        cy.reload();
        cy.get('[data-test-id="inactivePsy"]')
          .should('have.text', 'Vos informations ne sont pas visibles sur l‘annuaire.');
        cy.get('[data-test-id="activePsy"]')
          .should('not.exist');
      });
    });

    it('should not allow to click button when nothing is filled', () => {
      cy.get('[data-test-id="suspend-redirection-button"]')
        .click();

      cy.get('[data-test-id="suspend-button"]')
        .should('be.disabled');
    });

    it('should not allow to click button when only reason is filled', () => {
      cy.get('[data-test-id="suspend-redirection-button"]')
        .click();

      cy.get('[data-test-id="radio-reason-toomuch"]')
        .click();
      cy.get('[data-test-id="suspend-button"]')
        .should('be.disabled');
    });

    it('should not allow to click button when only duration is filled', () => {
      cy.get('[data-test-id="suspend-redirection-button"]')
        .click();

      cy.get('[data-test-id="radio-duration-week"]')
        .click();
      cy.get('[data-test-id="suspend-button"]')
        .should('be.disabled');
    });

    it('should allow to click button when reason and duration are filled', () => {
      cy.get('[data-test-id="suspend-redirection-button"]')
        .click();

      cy.get('[data-test-id="radio-reason-toomuch"]')
        .click();
      cy.get('[data-test-id="radio-duration-week"]')
        .click();
      cy.get('[data-test-id="suspend-button"]')
        .should('not.be.disabled');
    });

    it('should manage other reason', () => {
      cy.get('[data-test-id="suspend-redirection-button"]')
        .click();

      cy.get('[data-test-id="radio-duration-week"]')
        .click();

      cy.get('[data-test-id="radio-reason-other-input"]')
        .should('not.exist');

      cy.get('[data-test-id="radio-reason-other"]')
        .click();

      cy.get('[data-test-id="radio-reason-other-input"]')
        .should('exist');

      cy.get('[data-test-id="suspend-button"]')
        .should('be.disabled');

      cy.get('[data-test-id="radio-reason-other-input"]')
        .type('this is my reason !');

      cy.get('[data-test-id="suspend-button"]')
        .should('not.be.disabled');

      cy.get('[data-test-id="radio-reason-toomuch"]')
        .click();

      cy.get('[data-test-id="radio-reason-other-input"]')
        .should('not.exist');
    });

    it('should manage other duration', () => {
      cy.get('[data-test-id="suspend-redirection-button"]')
        .click();

      cy.get('[data-test-id="radio-reason-toomuch"]')
        .click();

      cy.get('[data-test-id="radio-duration-other-input"]')
        .should('not.exist');

      cy.get('[data-test-id="radio-duration-other"]')
        .click();

      cy.get('[data-test-id="radio-duration-other-input"]')
        .should('exist');

      cy.get('[data-test-id="suspend-button"]')
        .should('be.disabled');

      cy.get('[data-test-id="radio-duration-other-input"]')
        .click();

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);

      cy.get(`.react-datepicker__day--0${tomorrow.getDate()}`)
        .click();

      cy.get('[data-test-id="suspend-button"]')
        .should('not.be.disabled');

      cy.get('[data-test-id="radio-duration-week"]')
        .click();

      cy.get('[data-test-id="radio-duration-other-input"]')
        .should('not.exist');
    });

    const checkSuspension = (reason, duration, getStartDate, getEndDate) => {
      const start = getStartDate();
      cy.get('[data-test-id="suspend-redirection-button"]')
        .click();

      cy.get(`[data-test-id="radio-reason-${reason}"]`)
        .click();

      cy.get(`[data-test-id="radio-duration-${duration}"]`)
        .click();

      cy.get('[data-test-id="suspend-button"]')
        .click();

      cy.wait('@suspend').then(response => {
        const end = getEndDate();

        cy.wrap(response.request.body.reason).should('eq', reason);
        cy.wrap((new Date(response.request.body.date)).getTime() < end.getTime()).should('eq', true);
        cy.wrap((new Date(response.request.body.date)).getTime() > start.getTime()).should('eq', true);
      });
    };

    it('should suspend profile for a week because of too much request', () => {
      const addWeek = () => {
        const date = new Date();
        date.setDate(date.getDate() + 7);
        return date;
      };
      checkSuspension('toomuch', 'week', addWeek, addWeek);
    });

    it('should suspend profile for a month because of holidays', () => {
      const addMonth = () => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date;
      };
      checkSuspension('holidays', 'month', addMonth, addMonth);
    });

    it('should suspend profile forever because of reimbursments not there', () => {
      checkSuspension('reimbursments', 'forever', () => new Date('9999/12/30'), () => new Date('10000/01/01'));
    });

    it('should suspend profile forever because of convention not signed', () => {
      checkSuspension('convention', 'forever', () => new Date('9999/12/30'), () => new Date('10000/01/01'));
    });

    it('should suspend profil for custom reasons and custom date', () => {
      cy.get('[data-test-id="suspend-redirection-button"]')
        .click();

      cy.get('[data-test-id="radio-reason-other"]')
        .click();
      cy.get('[data-test-id="radio-reason-other-input"]')
        .type('parcequuuuuuuuuue');

      cy.get('[data-test-id="radio-duration-other"]')
        .click();

      cy.get('[data-test-id="radio-duration-other-input"]')
        .click();

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 2);

      cy.get(`.react-datepicker__day--0${tomorrow.getDate()}`)
        .click();

      cy.get('[data-test-id="suspend-button"]')
        .click();

      cy.wait('@suspend').then(response => {
        cy.wrap(response.request.body.reason).should('eq', 'Autre: parcequuuuuuuuuue');
        cy.wrap((new Date(response.request.body.date)).getFullYear()).should('eq', tomorrow.getFullYear());
        cy.wrap((new Date(response.request.body.date)).getMonth()).should('eq', tomorrow.getMonth());
        cy.wrap((new Date(response.request.body.date)).getDate()).should('eq', tomorrow.getDate());
      });
    });
  });
});
