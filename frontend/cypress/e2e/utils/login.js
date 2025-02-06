let currentUser = {};
let currentToken;

const setLoginInfo = () => {
  window.localStorage.setItem('xsrfToken', 'randomXSRFToken');
  cy.setCookie('token', currentToken);
};

const login = (psy, duration = 3600) => {
  cy.task('generateToken', { psy, duration }).then(token => {
    currentUser = psy;
    currentToken = token;
    setLoginInfo();
  });
};

const loginAsDefault = (duration = 3600) => cy.request('http://localhost:8080/test/psychologist/login@beta.gouv.fr')
  .then(res => {
    login(res.body.psy, duration);
  });

const logout = () => {
  cy.get('[data-test-id="logout-link"]').should('be.visible').click({ force: true });
};

export default {
  login,
  loginAsDefault,
  logout,
  getCurrentUser: () => currentUser,
  setLoginInfo,
};
