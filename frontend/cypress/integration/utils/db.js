const resetDB = () => {
  cy.request('POST', 'http://localhost:8080/test/reset');
};

export default { resetDB };
