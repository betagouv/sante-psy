/* eslint-disable max-len */
import chai from 'chai';
import app from '../../index';
import cookie from '../../utils/cookie';

describe('Route access should be forbidden to certain roles', () => {
  const routes = [
    { method: 'get', url: '/api/appointments', forbiddenRole: 'student' },
    { method: 'post', url: '/api/appointments', forbiddenRole: 'student' },
    { method: 'delete', url: '/api/appointments/495614e8-89af-4406-ba02-9fc038b991f9', forbiddenRole: 'student' },
    { method: 'get', url: '/api/patients', forbiddenRole: 'student' },
    { method: 'post', url: '/api/patients', forbiddenRole: 'student' },
    { method: 'get', url: '/api/patients/495614e8-89af-4406-ba02-9fc038b991f9', forbiddenRole: 'student' },
    { method: 'put', url: '/api/patients/495614e8-89af-4406-ba02-9fc038b991f9', forbiddenRole: 'student' },
    { method: 'delete', url: '/api/patients/495614e8-89af-4406-ba02-9fc038b991f9', forbiddenRole: 'student' },
    { method: 'post', url: '/api/psychologist/495614e8-89af-4406-ba02-9fc038b991f9/convention', forbiddenRole: 'student' },
    { method: 'post', url: '/api/psychologist/495614e8-89af-4406-ba02-9fc038b991f9/activate', forbiddenRole: 'student' },
    { method: 'post', url: '/api/psychologist/495614e8-89af-4406-ba02-9fc038b991f9/suspend', forbiddenRole: 'student' },
    { method: 'put', url: '/api/psychologist/495614e8-89af-4406-ba02-9fc038b991f9', forbiddenRole: 'student' },
    { method: 'get', url: '/api/student/495614e8-89af-4406-ba02-9fc038b991f9/appointments', forbiddenRole: '' },
    { method: 'get', url: '/api/student/495614e8-89af-4406-ba02-9fc038b991f9/appointments', forbiddenRole: 'psy' },
  ];

  routes.map((route) => it(
    `${route.method} ${route.url} should be unauthorized if not connected`,
    async () => chai.request(app)[route.method](route.url)
      .then((res) => res.status.should.equal(401)),
  ));

  routes.map((route) => it(
    `${route.method} ${route.url} should be forbidden to ${route.forbiddenRole || 'empty role'}`,
    async () => {
      const token = route.forbiddenRole === ''
        ? cookie.getJwtTokenForUser('495614e8-89af-4406-ba02-9fc038b991f9', 'xsrfToken')
        : cookie.getJwtTokenForUser('495614e8-89af-4406-ba02-9fc038b991f9', 'xsrfToken', route.forbiddenRole as 'psy' | 'student');

      return chai.request(app)[route.method](route.url)
          .set('Cookie', `token=${token}`)
          .set('xsrf-token', 'xsrfToken')
          .then((res) => res.status.should.equal(403));
    },
  ));
});
