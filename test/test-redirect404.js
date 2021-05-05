/* eslint-disable func-names */
const chai = require('chai');
const app = require('../index.ts');
const cookie = require('../utils/cookie');

describe('Redirect if unknown page - 404', () => {
  const psy = {
    dossierNumber: '9a42d12f-8328-4545-8da3-11250f876146',
    email: 'prenom.nom@beta.gouv.fr',
  };

  it('should redirect to index if unknown page and not loggued', async () => chai.request(app)
        .get('/unknown-pizza')
        .redirects(0)
        .then(async (res) => {
          res.should.redirectTo('/');
        }));

  it('should redirect to index page if unknown page and not loggued', async () => chai.request(app)
        .get('/psychologueunknown-pizza')
        .redirects(0)
        .then(async (res) => {
          res.should.redirectTo('/');
        }));

  it('should redirect to mes seances page if unknown page but loggued', async () => chai.request(app)
        .get('/psychologue/unknown-pizza')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0)
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances');
        }));

  it('should redirect to mes seances page if unknown page without /psychologue/ but loggued',
    async () => chai.request(app)
        .get('/unknown-pizza')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .redirects(0)
        .then(async (res) => {
          res.should.redirectTo('/psychologue/mes-seances');
        }));

  it('should redirect to login page if unknown page starting with /psychologue/ and not loggued',
    async () => chai.request(app)
        .get('/psychologue/unknown-pizza')
        .redirects(0)
        .then(async (res) => {
          res.should.redirectTo('/psychologue/login');
        }));
});
