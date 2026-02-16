let currentUser = {};

const setLoginInfo = (token, xsrfToken, role) => {
  const currentXsrfToken = xsrfToken;
  window.localStorage.setItem('xsrfToken', currentXsrfToken);
  if (role) {
    window.localStorage.setItem('role', role);
  }
  cy.setCookie('token', token);
};

const loginDefaultPsy = (duration = '2h') => cy.request({
  method: 'GET',
  url: 'http://localhost:8080/test/auth/psychologist/login@beta.gouv.fr',
  qs: { duration },
})
  .then(res => {
    currentUser = res.body.user;
    setLoginInfo(res.body.token, res.body.xsrfToken, 'psy');
  });

const loginDefaultStudent = (duration = '2h') => cy.request({
  method: 'GET',
  url: 'http://localhost:8080/test/auth/student/student@beta.gouv.fr',
  qs: { duration },
})
  .then(res => {
    currentUser = res.body.user;
    setLoginInfo(res.body.token, res.body.xsrfToken, 'student');
  });

const logout = () => {
  cy.get('[data-test-id="logout-link"]').should('be.visible').click({ force: true });
};

export default {
  loginDefaultPsy,
  loginDefaultStudent,
  logout,
  getCurrentUser: () => currentUser,
  setLoginInfo,
};
