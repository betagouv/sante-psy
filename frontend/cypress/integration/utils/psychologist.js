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

const signConvention = (name, isSigned) => cy.request('GET', 'http://localhost:8080/api/config')
  .then(response => {
    const university = response.body.universities.find(u => u.name === name);
    return cy.request({
      method: 'POST',
      url: 'http://localhost:8080/api/psychologue/renseigner-convention',
      body: {
        universityId: university.id,
        isConventionSigned: isSigned,
      },
      auth: { bearer: getCurrentToken() },
    });
  });

export default { removeConvention, signConvention, suspend };
