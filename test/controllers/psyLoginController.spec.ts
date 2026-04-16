import chai, { expect } from 'chai';
import { v4 as uuidv4 } from 'uuid';
import app from '../../index';

import dbPsychologists from '../../db/psychologists';
import dbUniversities from '../../db/universities';
import cookie from '../../utils/cookie';
import create from '../helper/create';

describe('psyLoginController', async () => {
  describe('login page', () => {

  describe('connected user information', () => {
    it('should return only my basic information', async () => {
      const universityId = uuidv4();
      await dbUniversities.upsertMany([
        {
          id: universityId,
          name: 'Monster university',
          emailSSU: 'monster@ssu.fr',
          emailUniversity: 'monster@university.fr',
        },
      ]);
      const psy = create.getOnePsy({
        assignedUniversityId: universityId,
        useFirstNames: 'George',
        useLastName: 'Sand',
      });
      psy.isConventionSigned = true;
      await dbPsychologists.upsertMany([psy]);

      return chai
        .request(app)
        .get('/api/auth/connected')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken', 'psy')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .then(async (res) => {
          res.body.should.have.all.keys('role', 'user');
          res.body.role.should.equal('psy');
          res.body.user.should.have.all.keys(
            'dossierNumber',
            'firstNames',
            'lastName',
            'useFirstNames',
            'useLastName',
            'email',
            'adeli',
            'address',
            'otherAddress',
            'convention',
            'active',
            'hasSeenTutorial',
            'createdAt',
          );
          res.body.user.dossierNumber.should.equal(psy.dossierNumber);
          res.body.user.firstNames.should.equal(psy.firstNames);
          res.body.user.lastName.should.equal(psy.lastName);
          res.body.user.useFirstNames.should.equal(psy.useFirstNames);
          res.body.user.useLastName.should.equal(psy.useLastName);
          res.body.user.email.should.equal(psy.email);
          res.body.user.adeli.should.equal(psy.adeli);
          res.body.user.active.should.equal(psy.active);
          res.body.user.convention.should.have.all.keys(
            'isConventionSigned',
            'universityName',
            'universityId',
          );
          res.body.user.convention.isConventionSigned.should.equal(true);
          res.body.user.convention.universityName.should.equal('Monster university');
          res.body.user.address.should.equal(psy.address);
        });
    });

    it('should return empty info when psy does not exist', async () => chai
        .request(app)
        .get('/api/auth/connected')
        .set('Cookie', `token=${cookie.getJwtTokenForUser(uuidv4(), 'randomXSRFToken', 'psy')}`)
        .then(async (res) => {
          res.body.should.have.all.keys('role', 'user');
          expect(res.body.role).to.be.null;
          expect(res.body.user).to.be.null;
        }));

    it('should return empty info if user is not connected', async () => chai
        .request(app)
        .get('/api/auth/connected')
        .then(async (res) => {
          res.body.should.have.all.keys('role', 'user');
          expect(res.body.role).to.be.null;
          expect(res.body.user).to.be.null;
        }));

    it('should return empty info if user does not have csrf', async () => {
      const psy = create.insertOnePsy();
      return chai
        .request(app)
        .get('/api/auth/connected')
        .set('Cookie', `token=${cookie.getJwtTokenForUser((await psy).dossierNumber, 'randomXSRFToken', 'psy')}`)
        .then(async (res) => {
          res.body.should.have.all.keys('role', 'user');
          expect(res.body.role).to.be.null;
          expect(res.body.user).to.be.null;
        });
    });
  });
});
