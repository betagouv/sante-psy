const jwt = require('jsonwebtoken');

const login = psy => window.localStorage.setItem('santepsytoken', jwt.sign(
  { email: psy.email, psychologist: psy.dossierNumber },
  // TODO: find a better way to sync this secret
  'production_value_should_be_set_in_.env',
  { expiresIn: '2 hours' },
));

const loginAsDefault = () => {
  cy.request('http://localhost:8080/test/psychologue/login@beta.gouv.fr')
    .then(r => {
      login(r.body.psy);
    });
};

const logout = () => {
  cy.get('[data-test-id="logout-button"]').click();
};

export default { login, loginAsDefault, logout };
