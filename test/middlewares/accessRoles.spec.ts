/* eslint-disable max-len */
import chai from 'chai';
import app from '../../index';
import cookie from '../../utils/cookie';

// FIXME: test are not working correctly - it succeeds even with allow roles
describe('Route access should be forbidden to certain roles', () => {
  const routes = [
    { method: 'get', url: '/api/appointments', forbiddenRoles: ['student'] },
    { method: 'post', url: '/api/appointments', forbiddenRoles: ['student'] },
    { method: 'delete', url: '/api/appointments/495614e8-89af-4406-ba02-9fc038b991f9', forbiddenRoles: ['student'] },
    { method: 'get', url: '/api/patients', forbiddenRoles: ['student'] },
    { method: 'post', url: '/api/patients', forbiddenRoles: ['student'] },
    { method: 'get', url: '/api/patients/495614e8-89af-4406-ba02-9fc038b991f9', forbiddenRoles: ['student'] },
    { method: 'put', url: '/api/patients/495614e8-89af-4406-ba02-9fc038b991f9', forbiddenRoles: ['student'] },
    { method: 'delete', url: '/api/patients/495614e8-89af-4406-ba02-9fc038b991f9', forbiddenRoles: ['student'] },
    { method: 'post', url: '/api/psychologist/495614e8-89af-4406-ba02-9fc038b991f9/convention', forbiddenRoles: ['student'] },
    { method: 'post', url: '/api/psychologist/495614e8-89af-4406-ba02-9fc038b991f9/activate', forbiddenRoles: ['student'] },
    { method: 'post', url: '/api/psychologist/495614e8-89af-4406-ba02-9fc038b991f9/suspend', forbiddenRoles: ['student'] },
    { method: 'put', url: '/api/psychologist/495614e8-89af-4406-ba02-9fc038b991f9', forbiddenRoles: ['student'] },
    { method: 'get', url: '/student/495614e8-89af-4406-ba02-9fc038b991f9', forbiddenRoles: ['', 'psy'] },
    { method: 'get', url: '/student/495614e8-89af-4406-ba02-9fc038b991f9/appointments', forbiddenRoles: ['', 'psy'] },
  ];

  routes.map((route) => route.forbiddenRoles.map((forbiddenRole) => it(
    `${route.method} ${route.url} should be forbidden to ${forbiddenRole || 'empty role'}`,
    () => {
      const token = forbiddenRole === ''
        ? cookie.getJwtTokenForUser('myUser', 'xsrfToken')
        : cookie.getJwtTokenForUser('myUser', 'xsrfToken', forbiddenRole as 'psy' | 'student');
      chai.request(app)[route.method](route.url)
                .set('Cookie', `token=${token}`)
                .set('xsrf-token', 'xsrfToken')
                .then((res) => res.status.should.equal(403));
    },
  )));
});
