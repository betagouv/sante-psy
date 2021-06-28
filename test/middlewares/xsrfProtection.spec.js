const chai = require('chai');
const app = require('../../index');
const cookie = require('../../utils/cookie');

describe('Route should be XSRF protected', () => {
  const routes = [
    { method: 'get', url: '/api/appointments' },
    { method: 'post', url: '/api/appointments' },
    { method: 'delete', url: '/api/appointments/495614e8-89af-4406-ba02-9fc038b991f9' },
    { method: 'get', url: '/api/patients' },
    { method: 'post', url: '/api/patients' },
    { method: 'get', url: '/api/patients/495614e8-89af-4406-ba02-9fc038b991f9' },
    { method: 'put', url: '/api/patients/495614e8-89af-4406-ba02-9fc038b991f9' },
    { method: 'delete', url: '/api/patients/495614e8-89af-4406-ba02-9fc038b991f9' },
    { method: 'get', url: '/api/psychologue/mes-remboursements' },
    { method: 'post', url: '/api/psychologue/renseigner-convention' },
    { method: 'post', url: '/api/psychologue/495614e8-89af-4406-ba02-9fc038b991f9/activate' },
    { method: 'post', url: '/api/psychologue/495614e8-89af-4406-ba02-9fc038b991f9/suspend' },
    { method: 'get', url: '/api/psychologue/495614e8-89af-4406-ba02-9fc038b991f9' },
    { method: 'put', url: '/api/psychologue/495614e8-89af-4406-ba02-9fc038b991f9' },
  ];

  routes.map((route) => it(`${route.method} ${route.url} without xsrf`,
    () => chai.request(app)[route.method](route.url)
  .set('Cookie', `token=${cookie.getJwtTokenForUser('myUser', 'randomXSRFToken')}`)
  .then((res) => res.status.should.equal(401))));

  routes.map((route) => it(`${route.method} ${route.url} with xsrf`,
    () => chai.request(app)[route.method](route.url)
  .set('Cookie', `token=${cookie.getJwtTokenForUser('myUser', 'randomXSRFToken')}`)
  .set('xsrf-token', 'randomXSRFToken')
  .then((res) => res.status.should.not.equal(401))));
});
