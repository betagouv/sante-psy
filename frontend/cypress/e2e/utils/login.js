let currentUser = {};

const setLoginInfo = (token, xsrfToken, role = 'psy') => {
  const currentXsrfToken = xsrfToken;
  window.localStorage.setItem('xsrfToken', currentXsrfToken);
  if (role) {
    window.localStorage.setItem('role', role);
  }
  cy.setCookie('token', token);
};

const loginAsDefault = (duration = '2h') => cy.request({
  method: 'GET',
  url: 'http://localhost:8080/test/auth/login@beta.gouv.fr',
  qs: { duration },
})
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
