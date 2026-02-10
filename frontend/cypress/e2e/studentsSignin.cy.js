const { resetDB } = require('./utils/db');

describe('StudentSignInStepTwo', () => {
  const validToken = 'valid-test-token-123';
  const testEmail = 'etudiant@test.fr';

  beforeEach(() => {
    resetDB(2025);

    cy.intercept(
      'POST',
      `/api/student/signIn/${validToken}`,
      {
        statusCode: 200,
        body: { email: testEmail },
      }
    ).as('verifyToken');

    cy.intercept('POST', '/api/student/signIn', req => {
      if (req.body.ine === '010203045AA') {
        req.reply({
          statusCode: 200,
          body: { success: true },
        });
      } else {
        req.reply({
          statusCode: 400,
          body: { shouldSendCertificate: true },
        });
      }
    }).as('signIn');

    cy.intercept('POST', '/api/student/send-certificate', {
      statusCode: 200,
      body: { success: true },
    }).as('sendCertificate');
  });

  it('displays form with valid token', () => {
    cy.visit(`/inscription/${validToken}`);
    cy.wait('@verifyToken');

    cy.get('form').should('exist');
  });

  it('shows field validation errors', () => {
    cy.visit(`/inscription/${validToken}`);
    cy.wait('@verifyToken');

    cy.get('#first-names-input').type('123').blur();
    cy.contains('Format incorrect du prénom.');

    cy.get('#ine-input').type('12').blur();
    cy.contains('Format incorrect du numéro INE.');
  });

  it('signs in successfully with valid INE', () => {
    cy.visit(`/inscription/${validToken}`);
    cy.wait('@verifyToken');

    cy.get('#first-names-input').type('Jean');
    cy.get('#last-name-input').type('Dupont');
    cy.get('#dateBirth-input').type('01/01/2001');
    cy.get('#ine-input').type('010203045AA');

    cy.get('button[type="submit"]').click();
    cy.wait('@signIn');

    cy.contains('Inscription validée');
  });

  it('shows certificate upload when INE invalid', () => {
    cy.visit(`/inscription/${validToken}`);
    cy.wait('@verifyToken');

    cy.get('#first-names-input').type('Jean');
    cy.get('#last-name-input').type('Dupont');
    cy.get('#dateBirth-input').type('01/01/2001');
    cy.get('#ine-input').type('999999999ZZ');

    cy.get('button[type="submit"]').click();
    cy.wait('@signIn');

    cy.contains('Ton accès doit être vérifié');
    cy.get('#file-upload').should('exist');
  });

  it('uploads certificate successfully', () => {
    cy.visit(`/inscription/${validToken}`);
    cy.wait('@verifyToken');

    cy.get('#first-names-input').type('Jean');
    cy.get('#last-name-input').type('Dupont');
    cy.get('#dateBirth-input').type('01/01/2001');
    cy.get('#ine-input').type('999999999ZZ');

    cy.get('button[type="submit"]').click();
    cy.wait('@signIn');

    cy.fixture('test-certificate.pdf', 'base64').then(fileContent => {
      cy.get('#file-upload').attachFile({
        fileContent,
        fileName: 'certificat.pdf',
        mimeType: 'application/pdf',
        encoding: 'base64',
      });
    });

    cy.contains('Envoyer mon certificat').click();
    cy.wait('@sendCertificate');

    cy.contains('Certificat envoyé');
  });

  it('shows error on conflict', () => {
    cy.intercept('POST', '/api/student/signIn', {
      statusCode: 400,
    }).as('conflict');

    cy.visit(`/inscription/${validToken}`);
    cy.wait('@verifyToken');

    cy.get('#first-names-input').type('Jean');
    cy.get('#last-name-input').type('Dupont');
    cy.get('#dateBirth-input').type('01/01/2001');
    cy.get('#ine-input').type('010203045AA');

    cy.get('button[type="submit"]').click();
    cy.wait('@conflict');

    cy.contains('Une erreur est survenue');
  });
});
