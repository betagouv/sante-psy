import chai from 'chai';
import app from '../../index';
import clean from '../helper/clean';
import create from '../helper/create';
import cookie from '../../utils/cookie';
import dbPsychologists from '../../db/psychologists';
import { DossierState } from '../../types/DossierState';

describe('conventionController', () => {
  describe('update convention info', () => {
    afterEach(async () => {
      await clean.universities();
    });

    it('should NOT update convention info if user not logged in', async () => {
      const psyEmail = 'login@beta.gouv.fr';
      const psy = await create.insertOnePsy(psyEmail, DossierState.accepte, false);

      return chai.request(app)
      .post(`/api/psychologist/${psy.dossierNumber}/convention`)
        .send({
          isConventionSigned: true,
        })
        .then(async (res) => {
          res.status.should.equal(401);
          res.body.message.should.equal('No authorization token was found');

          const updatedPsy = await dbPsychologists.getAcceptedByEmail(psyEmail);
          chai.expect(updatedPsy.isConventionSigned).to.be.false;
        });
    });

    it('should NOT update convention info if wrong user logged in', async () => {
      const targetPsyEmail = 'login@beta.gouv.fr';
      const connectedPsyEmail = 'connected@beta.gouv.fr';
      const targetPsy = await create.insertOnePsy(targetPsyEmail, DossierState.accepte, false);
      const connectedPsy = await create.insertOnePsy(connectedPsyEmail, DossierState.accepte, false);

      return chai.request(app)
      .post(`/api/psychologist/${targetPsy.dossierNumber}/convention`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(connectedPsy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          isConventionSigned: true,
        })
        .then(async (res) => {
          res.status.should.equal(403);

          const updatedPsy = await dbPsychologists.getAcceptedByEmail(targetPsyEmail);
          chai.expect(updatedPsy.isConventionSigned).to.be.false;
        });
    });

    it('should update convention info', async () => {
      const psyEmail = 'login@beta.gouv.fr';
      const psy = await create.insertOnePsy(psyEmail, DossierState.accepte, false);
      // Check that the fields we are testing are unset before test
      chai.expect(psy.isConventionSigned).to.be.false;

      return chai.request(app)
      .post(`/api/psychologist/${psy.dossierNumber}/convention`)
        .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
        .set('xsrf-token', 'randomXSRFToken')
        .send({
          isConventionSigned: true,
        })
        .then(async (res) => {
          res.status.should.equal(200);
          res.body.message.should.equal('Vos informations de conventionnement sont bien enregistrées.');

          const updatedPsy = await dbPsychologists.getAcceptedByEmail(psyEmail);
          chai.expect(updatedPsy.isConventionSigned).to.equal(true);
        });
    });

    const failValidation = async (payload, errorMessage) => {
      const psyEmail = 'login@beta.gouv.fr';
      const psy = await create.insertOnePsy(psyEmail, DossierState.accepte, false);
      // Check that the fields we are testing are unset before test
      chai.expect(psy.isConventionSigned).to.be.false;

      return chai.request(app)
      .post(`/api/psychologist/${psy.dossierNumber}/convention`)
      .set('Cookie', `token=${cookie.getJwtTokenForUser(psy.dossierNumber, 'randomXSRFToken')}`)
      .set('xsrf-token', 'randomXSRFToken')
        .send(payload)
        .then(async (res) => {
          res.status.should.equal(400);
          res.body.message.should.equal(errorMessage);

          const updatedPsy = await dbPsychologists.getAcceptedByEmail(psyEmail);
          chai.expect(updatedPsy.isConventionSigned).to.be.false;
        });
    };

    it('should not update if isConventionSigned is missing', async () => {
      await failValidation({
        // isConventionSigned: missing
      }, 'Vous devez spécifier si la convention est signée ou non.');
    });

    it('should not update if isConventionSigned is not a boolean', async () => {
      await failValidation({
        isConventionSigned: 'yes maybe',
      }, 'Vous devez spécifier si la convention est signée ou non.');
    });
  });
});
