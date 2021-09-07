import chai, { expect } from 'chai';
import app from '../../index';
import clean from '../helper/clean';
import dbPsychologists from '../../db/psychologists';
import { DossierState } from '../../types/DossierState';

describe('psyListingController', () => {
  let psyActive1;
  let psyActive2;
  let psyInactive;
  let psyArchived;

  before(async () => {
    await clean.cleanAllPsychologists();

    psyActive1 = clean.getOnePsy('active1@beta.gouv.fr');
    psyActive2 = clean.getOnePsy('active2@beta.gouv.fr');
    psyInactive = clean.getOneInactivePsy();
    psyArchived = clean.getOnePsy('archived@beta.gouv.fr', DossierState.accepte, true);
    await dbPsychologists.upsertMany([psyActive1, psyActive2, psyInactive, psyArchived]);
  });

  describe('getReducedActive', () => {
    it('should return all active psy', async () => {
      const res = await chai.request(app)
        .get('/api/trouver-un-psychologue/reduced');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);
      const resDossierNumbers = res.body.map((p) => p.dossierNumber);
      expect(resDossierNumbers).to.have.members([
        psyActive1.dossierNumber,
        psyActive2.dossierNumber,
      ]);
      expect(res.body[0]).to.have.all.keys([
        'dossierNumber',
        'firstNames',
        'lastName',
        'teleconsultation',
        'address',
        'departement',
        'region',
        'longitude',
        'latitude',
      ]);
    });
  });

  describe('getFullActive', () => {
    it('should return all active psy', async () => {
      const res = await chai.request(app)
        .get('/api/trouver-un-psychologue');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);
      const resDossierNumbers = res.body.map((p) => p.dossierNumber);
      expect(resDossierNumbers).to.have.members([
        psyActive1.dossierNumber,
        psyActive2.dossierNumber,
      ]);
      expect(res.body[0]).to.have.all.keys([
        'dossierNumber',
        'firstNames',
        'lastName',
        'teleconsultation',
        'address',
        'departement',
        'region',
        'adeli',
        'description',
        'email',
        'languages',
        'phone',
        'website',
        'longitude',
        'latitude',
      ]);
    });
  });
});
