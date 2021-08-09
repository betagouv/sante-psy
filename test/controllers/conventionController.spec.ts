import chai from 'chai';
import app from '../../index';
import clean from '../helper/clean';
import cookie from '../../utils/cookie';
import dbPsychologists from '../../db/psychologists';
import dbUniversities from '../../db/universities';
import { DossierState } from '../../types/DossierState';

describe('conventionController', () => {
  describe('update convention info', () => {
    let university;

    beforeEach(async () => {
      university = await dbUniversities.insertByName('--- Aucune pour le moment');
      university = await dbUniversities.insertByName('Cool U dude');
    });

    afterEach(async () => {
      await clean.cleanAllUniversities();
    });

    it('should NOT update convention info if user not logged in', async () => {
      const psyEmail = 'login@beta.gouv.fr';
      const psy = await clean.insertOnePsy(psyEmail, DossierState.accepte, false);

      return chai.request(app)
      .post(`/api/psychologist/${psy.dossierNumber}/convention`)
        .send({
          isConventionSigned: true,
          universityId: university.id,
        })
        .then(async (res) => {
          res.status.should.equal(401);
          res.body.message.should.equal('No authorization token was found');

          const updatedPsy = await dbPsychologists.getAcceptedByEmail(psyEmail);
          chai.expect(updatedPsy.isConventionSigned).not.to.exist;
          chai.expect(updatedPsy.assignedUniversityId).to.not.equal(university.id);
        });
    });

    it('should NOT update convention info if wrong user logged in', async () => {
      const targetPsyEmail = 'login@beta.gouv.fr';
      const connectedPsyEmail = 'connected@beta.gouv.fr';
      const targetPsy = await clean.insertOnePsy(targetPsyEmail, DossierState.accepte, false);
      const connectedPsy = await clean.insertOnePsy(connectedPsyEmail, DossierState.accepte, false);

      return chai.request(app)
      .post(`/api/psychologist/${targetPsy.dossierNumber}/convention`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(connectedPsy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          isConventionSigned: true,
          universityId: university.id,
        })
        .then(async (res) => {
          res.status.should.equal(403);

          const updatedPsy = await dbPsychologists.getAcceptedByEmail(targetPsyEmail);
          chai.expect(updatedPsy.isConventionSigned).not.to.exist;
          chai.expect(updatedPsy.assignedUniversityId).to.not.equal(university.id);
        });
    });

    it('should update convention info', async () => {
      const psyEmail = 'login@beta.gouv.fr';
      const psy = await clean.insertOnePsy(psyEmail, DossierState.accepte, false);
      // Check that the fields we are testing are unset before test
      chai.expect(psy.isConventionSigned).not.to.exist;

      return chai.request(app)
      .post(`/api/psychologist/${psy.dossierNumber}/convention`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          isConventionSigned: true,
          universityId: university.id,
        })
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.message.should.equal('Vos informations de conventionnement sont bien enregistrées.');

          const updatedPsy = await dbPsychologists.getAcceptedByEmail(psyEmail);
          chai.expect(updatedPsy.isConventionSigned).to.equal(true);
          chai.expect(updatedPsy.assignedUniversityId).to.equal(university.id);
        });
    });

    const failValidation = async (payload, errorMessage) => {
      const psyEmail = 'login@beta.gouv.fr';
      const psy = await clean.insertOnePsy(psyEmail, DossierState.accepte, false);
      // Check that the fields we are testing are unset before test
      chai.expect(psy.isConventionSigned).not.to.exist;

      return chai.request(app)
      .post(`/api/psychologist/${psy.dossierNumber}/convention`)
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
        .send(payload)
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(errorMessage);

          const updatedPsy = await dbPsychologists.getAcceptedByEmail(psyEmail);
          chai.expect(updatedPsy.isConventionSigned).not.to.exist;
        });
    };

    it('should not update if isConventionSigned is missing', async () => {
      await failValidation({
        // isConventionSigned: missing
        universityId: university.id,
      }, 'Vous devez spécifier si la convention est signée ou non.');
    });

    it('should not update if universityId is missing', async () => {
      await failValidation({
        isConventionSigned: false,
        // universityId: missing
      }, 'Vous devez choisir une université.');
    });

    it('should not update if isConventionSigned is not a boolean', async () => {
      await failValidation({
        isConventionSigned: 'yes maybe',
        universityId: university.id,
      }, 'Vous devez spécifier si la convention est signée ou non.');
    });

    it('should not update if universityId is not a uuid', async () => {
      await failValidation({
        isConventionSigned: true,
        universityId: 'not a uuid',
      }, 'Vous devez choisir une université.');
    });

    it('should not update if convention is signed and no university now selected', async () => {
      const noUniversity = await dbUniversities.getNoUniversityNow();
      await failValidation({
        isConventionSigned: true,
        universityId: noUniversity.id,
      }, 'Impossible de signer une convention avec cette université.');
    });
  });
});
