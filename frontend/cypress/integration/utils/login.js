const jwt = require('jsonwebtoken');

const login = psy => window.localStorage.setItem('santepsytoken', jwt.sign(
  { email: psy.email, psychologist: psy.dossierNumber },
  // TODO: find a better way to sync this secret
  'production_value_should_be_set_in_.env',
  { expiresIn: '2 hours' },
));

export default { login };
