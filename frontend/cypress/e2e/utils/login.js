let currentUser = {};

const setLoginInfo = (token, xsrfToken) => {
  const currentXsrfToken = xsrfToken;
  window.localStorage.setItem('xsrfToken', currentXsrfToken);
  cy.setCookie('token', token);
};

const loginAsDefault = () => cy.request('http://localhost:8080/test/psychologist/login@beta.gouv.fr')
  .then(res => {
    currentUser = res.body.psy;
    setLoginInfo(res.body.token, res.body.xsrfToken);
  });

const logout = () => {
  cy.get('[data-test-id="logout-link"]').should('be.visible').click({ force: true });
};

export default {
  loginAsDefault,
  logout,
  getCurrentUser: () => currentUser,
  setLoginInfo,
};
