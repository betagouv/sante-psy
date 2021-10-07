const resetDB = () => {
  cy.request('POST', 'http://localhost:8080/test/reset');
};

const resetTutorial = (email = 'login@beta.gouv.fr') => {
  cy.request('DELETE', `http://localhost:8080/test/psychologist/${email}/hasSeenTutorial`);
};

export default { resetDB, resetTutorial };
