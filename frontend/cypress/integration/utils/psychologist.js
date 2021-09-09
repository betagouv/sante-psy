const { getCurrentUser, setLoginInfo } = require('./login');

const removeConvention = email => cy.request('DELETE', `http://localhost:8080/test/psychologist/${email}/convention`);

const suspend = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  setLoginInfo();
  return cy.request({
    method: 'POST',
    url: `http://localhost:8080/api/psychologist/${getCurrentUser().dossierNumber}/suspend`,
    headers: { 'xsrf-token': 'randomXSRFToken' },
    body: {
      date,
      reason: 'because you are too awesome',
    },
  });
};

const signConvention = isSigned => {
  setLoginInfo();
  return cy.request({
    method: 'POST',
    url: `http://localhost:8080/api/psychologist/${getCurrentUser().dossierNumber}/convention`,
    headers: { 'xsrf-token': 'randomXSRFToken' },
    body: { isConventionSigned: isSigned },
  });
};

export default { removeConvention, signConvention, suspend };
