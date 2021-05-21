const chai = require('chai');
const { expect } = require('chai');
const jwt = require('../utils/jwt');
const app = require('../index.ts');
const clean = require('./helper/clean');
const dbPsychologists = require('../db/psychologists');
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');

describe('psyProfileController', () => {
  describe('getPsyProfile', () => {
    afterEach(async () => {
      await clean.cleanAllPsychologists();
    });

    it('should return 401 if user is not logged in', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = psyList[0];

      return chai.request(app)
        .get(`/api/psychologue/${psy.dossierNumber}`)
        .then(async (res) => {
          res.status.should.equal(401);
        });
    });

    it('should not return psy profile if user logged in is not the same as the param', async () => {
      const loggedPsyList = clean.psyList();
      const targetPsyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(loggedPsyList, targetPsyList);

      const loggedPsy = loggedPsyList[0];
      const targetPsy = targetPsyList[0];

      return chai.request(app)
        .get(`/api/psychologue/${targetPsy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(loggedPsy.email, loggedPsy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal('Erreur lors de la récupération du profil.');
        });
    });

    it('should not return psy profile if not accepted', async () => {
      const psyList = clean.psyList();
      psyList[0].state = demarchesSimplifiees.DOSSIER_STATE.sans_suite;
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = psyList[0];

      return chai.request(app)
        .get(`/api/psychologue/${psy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(false);
          res.body.message.should.equal("Votre dossier n'est pas accepté, \
          vous ne pouvez pas visualiser ces informations.");
        });
    });

    it('should return psy profile', async () => {
      const psyList = clean.psyList();
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = psyList[0];

      return chai.request(app)
        .get(`/api/psychologue/${psy.dossierNumber}`)
        .set('Authorization', `Bearer ${jwt.getJwtTokenForUser(psy.email, psy.dossierNumber)}`)
        .then(async (res) => {
          res.body.success.should.equal(true);

          const returnedPsy = res.body.psychologist;
          expect(returnedPsy).to.be.an('object').that.has.all.keys(
            'firstNames',
            'lastName',
            'email',
            'address',
            'departement',
            'region',
            'phone',
            'website',
            'teleconsultation',
            'description',
            'languages',
            'training',
            'diploma',
            'personalEmail',
          );
          expect(returnedPsy.email).to.eql(psy.email);
          expect(returnedPsy.firstNames).to.eql(psy.firstNames);
          // TODO: complete
        });
    });
  });
});
