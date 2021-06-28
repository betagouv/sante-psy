const jwt = require('jsonwebtoken');

let currentUser = {};
let currentToken;

const login = (psy, duration = 3600) => {
  currentUser = psy;
  currentToken = jwt.sign(
    { psychologist: psy.dossierNumber },
    // TODO: find a better way to sync this secret
    'production_value_should_be_set_in_.env',
    { expiresIn: `${duration / 3600} hours` },
  );
  cy.setCookie('token', currentToken);
};

const loginAsDefault = (duration = 3600) => {
  cy.request('http://localhost:8080/test/psychologue/login@beta.gouv.fr')
    .then(res => {
      login(res.body.psy, duration);
    });
};

const logout = () => {
  cy.get('[data-test-id="logout-button"]').click({ force: true });
};

export default {
  login,
  loginAsDefault,
  logout,
  getCurrentUser: () => currentUser,
  getCurrentToken: () => currentToken,
};
