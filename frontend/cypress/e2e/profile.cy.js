const { checkConvention } = require('../../src/services/conventionVerification');
const { loginAsDefault } = require('./utils/login');
const { resetDB } = require('./utils/db');
const { selectNextCalendarDate } = require('./utils/calendar');
const { suspend } = require('./utils/psychologist');

describe('Profile', () => {
  beforeEach(() => {
    cy.intercept('POST', '/api/psychologist/*/suspend').as('suspend');
    cy.intercept('POST', '/api/psychologist/*/activate').as('activate');
    cy.intercept('GET', '/api/psychologist/*').as('getProfile');
    cy.intercept('PUT', '/api/psychologist/*').as('updateProfile');
    cy.intercept('GET', '/api/config').as('config');

    resetDB();
    loginAsDefault();
    checkConvention();

    cy.visit('/psychologue/tableau-de-bord');
    cy.wait('@config');
    cy.wait('@getProfile');
  });

  describe('Display profile', () => {
    it('should display profile in non edition mode when existing', () => {
      cy.get('[data-test-id="edit-profile-form"]').should('not.exist');
    });
  });

  describe('Update profile', () => {
    it('should update existing profile', () => {
      cy.get('[data-test-id="show-profile-form-button"]').click();
      cy.get('[data-test-id="edit-profile-form"]').should('exist');
      cy.get('[data-test-id="psy-personal-email-input"] > input').clear();
      cy.get('[data-test-id="psy-personal-email-input"] > input').type('new@beta.gouv.fr');
      cy.get('[data-test-id="teleConsultation-true"]').click();
      cy.get('[data-test-id="save-profile-button"]').click();
      cy.wait('@updateProfile');
      cy.get('[data-test-id="edit-profile-form"]').should('not.exist');
      cy.get('[data-test-id="notification-success"] p').should(
        'have.text',
        'Vos informations ont bien été mises à jour.',
      );
    });

    it('should update existing profile with website override', () => {
      cy.get('[data-test-id="show-profile-form-button"]').click();
      cy.get('[data-test-id="edit-profile-form"]').should('exist');
      cy.get('[data-test-id="psy-website-input"] > input').clear();
      cy.get('[data-test-id="psy-website-input"] > input').type('doctolib.fr');
      cy.get('[data-test-id="psy-website-input"] > input').blur();
      cy.get('[data-test-id="psy-website-input"] > input').should(
        'have.value',
        'http://doctolib.fr',
      );
      cy.get('[data-test-id="psy-website-input"] > input')
        .clear();
      cy.get('[data-test-id="psy-website-input"] > input')
        .type('http://doctolib.fr');
      cy.get('[data-test-id="psy-website-input"] > input')
        .blur();
      cy.get('[data-test-id="psy-website-input"] > input').should(
        'have.value',
        'http://doctolib.fr',
      );
      cy.get('[data-test-id="psy-website-input"] > input')
        .clear();
      cy.get('[data-test-id="psy-website-input"] > input')
        .type('https://doctolib.fr');
      cy.get('[data-test-id="psy-website-input"] > input')
        .blur();
      cy.get('[data-test-id="psy-website-input"] > input').should(
        'have.value',
        'https://doctolib.fr',
      );
      cy.get('[data-test-id="psy-website-input"] > input')
        .clear();
      cy.get('[data-test-id="psy-website-input"] > input')
        .type('   ');
      cy.get('[data-test-id="psy-website-input"] > input')
        .blur();
      cy.get('[data-test-id="psy-website-input"] > input').should(
        'have.value',
        '   ',
      );
    });
  });

  describe('Display availability status', () => {
    it('should display psy availability status', () => {
      cy.get('[data-test-id="show-availability-form"]').should('exist');
      cy.get('[data-test-id="show-availability-form"] p').should(
        'contain.text',
        "Disponible dans l'annuaire",
      );
    });
  });

  describe('Reactivate profile', () => {
    it('should reactivate profile when asked', () => {
      suspend().then(() => {
        cy.reload();
        cy.get('[data-test-id="show-availability-form"]').click();
        cy.get('[data-test-id="activate-button"]').click();
        cy.wait('@activate');
        cy.get('[data-test-id="show-availability-form"] p').should(
          'contain.text',
          "Disponible dans l'annuaire",
        );
        cy.get('[data-test-id="notification-success"] p')
          .should(
            'have.text',
            'Vos informations sont de nouveau visibles sur l\'annuaire.',
          );
      });
    });
  });

  describe('Suspend profile', () => {
    it('should say that your profile is suspended', () => {
      cy.get('[data-test-id="show-public-profile-button"]').should('exist');
      cy.get('[data-test-id="show-availability-form"] p').should(
        'have.text',
        "Disponible dans l'annuaire",
      );

      suspend().then(() => {
        cy.reload();
        cy.get('[data-test-id="show-availability-form"] p').should(
          'contain.text',
          "Invisible dans l'annuaire",
        );
        cy.get('[data-test-id="show-public-profile-button"]').should(
          'not.exist',
        );
      });
    });

    it('should not allow to click button when nothing is filled', () => {
      cy.get('[data-test-id="show-availability-form"]').click();
      cy.get('[data-test-id="suspend-redirection-button"]').should(
        'be.disabled',
      );
    });

    it('should not allow to click button when only reason is filled', () => {
      cy.get('[data-test-id="show-availability-form"]').click();
      cy.get('[data-test-id="radio-reason-toomuch"]').click();
      cy.get('[data-test-id="suspend-redirection-button"]').should(
        'be.disabled',
      );
    });

    it('should not allow to click button when only duration is filled', () => {
      cy.get('[data-test-id="show-availability-form"]').click();
      cy.get('[data-test-id="radio-duration-week"]').click();
      cy.get('[data-test-id="suspend-redirection-button"]').should(
        'be.disabled',
      );
    });

    it('should allow to click button when reason and duration are filled', () => {
      cy.get('[data-test-id="show-availability-form"]').click();
      cy.get('[data-test-id="radio-reason-toomuch"]').click();
      cy.get('[data-test-id="radio-duration-week"]').click();
      cy.get('[data-test-id="suspend-redirection-button"]').should(
        'not.be.disabled',
      );
    });

    it('should manage other reason', () => {
      cy.get('[data-test-id="show-availability-form"]').click();
      cy.get('[data-test-id="radio-duration-week"]').click();
      cy.get('[data-test-id="radio-reason-other-input"]').should('not.exist');
      cy.get('[data-test-id="radio-reason-other"]').click();
      cy.get('[data-test-id="radio-reason-other-input"]').should('exist');
      cy.get('[data-test-id="suspend-redirection-button"]').should(
        'be.disabled',
      );

      cy.get('[data-test-id="radio-reason-other-input"]').type(
        'this is my reason !',
      );

      cy.get('[data-test-id="suspend-redirection-button"]').should(
        'not.be.disabled',
      );

      cy.get('[data-test-id="radio-reason-toomuch"]').click();

      cy.get('[data-test-id="radio-reason-other-input"]').should('not.exist');
    });

    it('should manage other duration', () => {
      cy.get('[data-test-id="show-availability-form"]').click();

      cy.get('[data-test-id="radio-reason-toomuch"]').click();

      cy.get('[data-test-id="radio-duration-other-input"]').should('not.exist');

      cy.get('[data-test-id="radio-duration-other"]').click();

      cy.get('[data-test-id="radio-duration-other-input"]').should('exist');

      cy.get('[data-test-id="suspend-redirection-button"]').should(
        'be.disabled',
      );

      cy.get('[data-test-id="radio-duration-other-input"]').click();

      selectNextCalendarDate();

      cy.get('[data-test-id="suspend-redirection-button"]').should(
        'not.be.disabled',
      );

      cy.get('[data-test-id="radio-duration-week"]').click();

      cy.get('[data-test-id="radio-duration-other-input"]').should('not.exist');
    });

    const checkSuspension = (reason, duration, getStartDate, getEndDate) => {
      const start = getStartDate();

      cy.get('[data-test-id="show-availability-form"]').click();

      cy.get(`[data-test-id="radio-reason-${reason}"]`).click();

      cy.get(`[data-test-id="radio-duration-${duration}"]`).click();

      cy.get('[data-test-id="suspend-redirection-button"]').click();

      cy.wait('@suspend').then(response => {
        const end = getEndDate();

        cy.wrap(response.request.body.reason).should('eq', reason);
        cy.wrap(
          new Date(response.request.body.date).getTime() < end.getTime(),
        ).should('eq', true);
        cy.wrap(
          new Date(response.request.body.date).getTime() > start.getTime(),
        ).should('eq', true);
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

    it('should suspend profile forever because of reimbursements not there', () => {
      checkSuspension(
        'reimbursments',
        'forever',
        () => new Date('9999/12/30'),
        () => new Date('10000/01/01'),
      );
    });

    it('should suspend profile forever because of convention not signed', () => {
      checkSuspension(
        'convention',
        'forever',
        () => new Date('9999/12/30'),
        () => new Date('10000/01/01'),
      );
    });

    it('should suspend profil for custom reasons and custom date', () => {
      cy.get('[data-test-id="show-availability-form"]').click();

      cy.get('[data-test-id="radio-reason-other"]').click();
      cy.get('[data-test-id="radio-reason-other-input"]').type(
        'parcequuuuuuuuuue',
      );

      cy.get('[data-test-id="radio-duration-other"]').click();

      cy.get('[data-test-id="radio-duration-other-input"]').click();

      const nextCalendarDate = selectNextCalendarDate();

      cy.get('[data-test-id="suspend-redirection-button"]').click();

      cy.wait('@suspend').then(response => {
        cy.wrap(response.request.body.reason).should(
          'eq',
          'Autre: parcequuuuuuuuuue',
        );
        cy.wrap(new Date(response.request.body.date).getFullYear()).should(
          'eq',
          nextCalendarDate.getFullYear(),
        );
        cy.wrap(new Date(response.request.body.date).getMonth()).should(
          'eq',
          nextCalendarDate.getMonth(),
        );
        cy.wrap(new Date(response.request.body.date).getDate()).should(
          'eq',
          nextCalendarDate.getDate(),
        );
      });
    });
  });

  describe('Incomplete profile', () => {
    it('should not display alert if profile is complete', () => {
      cy.get('[data-test-id="incomplete-profile-alert"]').should('not.exist');
    });

    it('should display alert for all incomplete info', () => {
      cy.get('[data-test-id="show-profile-form-button"]').click();
      cy.get('[data-test-id="psy-address-input"] > input')
        .clear();
      cy.get('[data-test-id="psy-address-input"] > input')
        .type('nimps...');
      cy.get('[data-test-id="psy-other-address-input"] > input')
        .clear();
      cy.get('[data-test-id="psy-other-address-input"] > input')
        .type('super nimps...');
      cy.get('[data-test-id="psy-website-input"] > input')
        .clear();
      cy.get('[data-test-id="psy-website-input"] > input')
        .type('doctolib');
      cy.get('[data-test-id="psy-description-input"] > textarea')
        .clear();
      cy.get('[data-test-id="psy-description-input"] > textarea')
        .type('cest court !');
      cy.get('[data-test-id="save-profile-button"]').click();
      cy.wait('@updateProfile');
      cy.get('[data-test-id="incomplete-profile-alert"]').should('exist');
      cy.get('[data-test-id="incomplete-profile-alert"]')
        // eslint-disable-next-line max-len
        .should(
          'have.text',
          "Votre profil est incompletCela n‘est pas bloquant mais pourrait empêcher les étudiants et étudiantes de vous contacter ou d‘identifier si vous répondez à leurs attentes.Votre présentation est trop courte.Votre site internet ne semble pas valide.L'adresse nimps... ne semble pas valide.L'adresse super nimps... ne semble pas valide.",
        );
    });
  });

  describe('Check website url', () => {
    it('should display alert if website does not have right url', () => {
      cy.get('[data-test-id="show-profile-form-button"]').click();
      cy.get('[data-test-id="psy-website-input"] > input')
        .clear();
      cy.get('[data-test-id="psy-website-input"] > input')
        .type('doctolib');
      cy.get('[data-test-id="save-profile-button"]').click();
      cy.wait('@updateProfile');
      cy.get('[data-test-id="incomplete-profile-alert"]').should('exist');
      cy.get('[data-test-id="incomplete-profile-alert"]')
        // eslint-disable-next-line max-len
        .should(
          'have.text',
          'Votre profil est incompletCela n‘est pas bloquant mais pourrait empêcher les étudiants et étudiantes de vous contacter ou d‘identifier si vous répondez à leurs attentes.Votre site internet ne semble pas valide.',
        );
    });

    it('should NOT display alert if website doesnt have http or https', () => {
      cy.get('[data-test-id="show-profile-form-button"]').click();
      cy.get('[data-test-id="psy-website-input"] > input')
        .clear();
      cy.get('[data-test-id="psy-website-input"] > input')
        .type('doctolib.com');
      cy.get('[data-test-id="psy-appointmentLink-input"] > input')
        .clear();
      cy.get('[data-test-id="psy-appointmentLink-input"] > input')
        .type('docto-lib.blabla');
      cy.get('[data-test-id="save-profile-button"]').click();
      cy.wait('@updateProfile');
      cy.get('[data-test-id="incomplete-profile-alert"]').should('not.exist');
    });

    it('should NOT display alert if website has right url', () => {
      cy.get('[data-test-id="show-profile-form-button"]').click();
      cy.get('[data-test-id="psy-website-input"] > input')
        .clear();
      cy.get('[data-test-id="psy-website-input"] > input')
        .type('http://doctolib.frnet');
      cy.get('[data-test-id="save-profile-button"]').click();
      cy.wait('@updateProfile');
      cy.get('[data-test-id="incomplete-profile-alert"]').should('not.exist');
    });
  });
});
