const removeConvention = email => {
  cy.request('DELETE', `http://localhost:8080/test/psychologue/${email}/convention`);
};

export default { removeConvention };
