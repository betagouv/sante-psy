const { getCurrentUser } = require('./login');

const removeConvention = email => cy.request('DELETE', `http://localhost:8080/test/psychologist/${email}/convention`);

const suspend = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);

  return cy.window().then(window => {
    const xsrfToken = window.localStorage.getItem('xsrfToken');
    return cy.request({
      method: 'POST',
      url: `http://localhost:8080/api/psychologist/${getCurrentUser().dossierNumber}/suspend`,
      headers: { 'xsrf-token': xsrfToken },
      body: {
        date,
        reason: 'because you are too awesome',
      },
    });
  });
};

const signConvention = isSigned => cy.window().then(window => {
  const xsrfToken = window.localStorage.getItem('xsrfToken');
  return cy.request({
    method: 'POST',
    url: `http://localhost:8080/api/psychologist/${getCurrentUser().dossierNumber}/convention`,
    headers: { 'xsrf-token': xsrfToken },
    body: { isConventionSigned: isSigned },
  });
});

export default { removeConvention, signConvention, suspend };
