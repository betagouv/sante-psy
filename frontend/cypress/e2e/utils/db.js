const resetDB = year => {
  const url = year ? `http://localhost:8080/test/reset?year=${year}` : 'http://localhost:8080/test/reset';
  cy.request('POST', url);
};

const resetTutorial = (email = 'login@beta.gouv.fr') => {
  cy.request('DELETE', `http://localhost:8080/test/psychologist/${email}/hasSeenTutorial`);
};

export default { resetDB, resetTutorial };
