// const jwt = require('jsonwebtoken');

// const login = (psy, duration = 3600) => window.localStorage.setItem('santepsytoken', jwt.sign(
//   { psychologist: psy.dossierNumber },
//   // TODO: find a better way to sync this secret
//   'production_value_should_be_set_in_.env',
//   { expiresIn: `${duration / 3600} hours` },
// ));

// const loginAsDefault = (duration = 3600) => {
//   cy.request('http://localhost:8080/test/psychologue/login@beta.gouv.fr')
//     .then(res => {
//       login(res.body.psy, duration);
//     });
// };

// const logout = () => {
//   cy.get('[data-test-id="logout-button"]').click();
// };

// export default { login, loginAsDefault, logout };
