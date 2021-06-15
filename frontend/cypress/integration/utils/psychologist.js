const { getCurrentUser, getCurrentToken } = require('./login');

const removeConvention = email => {
  cy.request('DELETE', `http://localhost:8080/test/psychologue/${email}/convention`);
};

const suspend = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return cy.request({
    method: 'POST',
    url: `http://localhost:8080/api/psychologue/${getCurrentUser().dossierNumber}/suspend`,
    auth: { bearer: getCurrentToken() },
    body: {
      date,
      reason: 'because you are too awesome',
    },
  });
};

export default { removeConvention, suspend };
