import chai, { expect } from 'chai';
import app from '../../index';
import clean from '../helper/clean';
import create from '../helper/create';
import dbPsychologists from '../../db/psychologists';

describe('psyListingController', () => {
  let psyActive1;
  let psyActive2;
  let psyInactive;
  let psyArchived;

  before(async () => {
    await clean.psychologists();

    psyActive1 = create.getOnePsy({
      personalEmail: 'active1@beta.gouv.fr',
      firstNames: 'Victor',
      lastName: 'Hugo',
      description: 'Psychologue spécialisé en anxiété',
      languages: 'français, anglais, arabe',
    });
    psyActive2 = create.getOnePsy({
      personalEmail: 'active2@beta.gouv.fr',
      firstNames: 'Amantine Aurore Lucile',
      lastName: 'Dupin',
      useFirstNames: 'Géorgïe',
      useLastName: 'Sand',
      isVeryAvailable: true,
      description: 'Psychologue en gestion du stress',
      languages: 'Francais, espagnol',
    });
    psyInactive = create.getOneInactivePsy();
    psyArchived = create.getOnePsy({ personalEmail: 'archived@beta.gouv.fr', archived: true });
    await dbPsychologists.upsertMany([psyActive1, psyActive2, psyInactive, psyArchived]);
  });

  describe('getReducedActive', () => {
    it('should return all active psy', async () => {
      const res = await chai.request(app)
        .get('/api/trouver-un-psychologue/reduced');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);

      const resultPsyActive2 = res.body[0];
      expect(resultPsyActive2.dossierNumber).to.equals(psyActive2.dossierNumber);
      expect(resultPsyActive2.firstNames).to.equals('Géorgïe');
      expect(resultPsyActive2.lastName).to.equals('Sand');

      const resultPsyActive1 = res.body[1];
      expect(resultPsyActive1.dossierNumber).to.equals(psyActive1.dossierNumber);
      expect(resultPsyActive1.firstNames).to.equals('Victor');
      expect(resultPsyActive1.lastName).to.equals('Hugo');

      const expectedKeys = [
        'dossierNumber',
        'firstNames',
        'lastName',
        'teleconsultation',
        'departement',
        'region',
        'address',
        'longitude',
        'latitude',
        'city',
        'postcode',
        'otherAddress',
        'otherLongitude',
        'otherLatitude',
        'otherCity',
        'otherPostcode',
        'languages',
        'email',
        'phone',
      ];
      expect(resultPsyActive1).to.have.all.keys(expectedKeys);
      expect(resultPsyActive2).to.have.all.keys(expectedKeys);
    });

    it('should filter psy by name', async () => {
      const res = await chai.request(app)
        .get('/api/trouver-un-psychologue/reduced')
        .query({ name: 'georgie' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(1);
      expect(res.body[0].dossierNumber).to.equals(psyActive2.dossierNumber);
      expect(res.body[0].firstNames).to.equals('Géorgïe');
      expect(res.body[0].lastName).to.equals('Sand');
    });

    it('should filter psy by speciality', async () => {
      const res = await chai.request(app)
        .get('/api/trouver-un-psychologue/reduced')
        .query({ speciality: 'Anxiete' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(1);
      expect(res.body[0].dossierNumber).to.equals(psyActive1.dossierNumber);
      expect(res.body[0].description).to.include('anxiété');
    });

    it('should filter psy by languages', async () => {
      const res = await chai.request(app)
        .get('/api/trouver-un-psychologue/reduced')
        .query({ language: 'francais' });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);
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
        'title',
        'firstNames',
        'lastName',
        'teleconsultation',
        'departement',
        'region',
        'address',
        'longitude',
        'latitude',
        'city',
        'postcode',
        'otherAddress',
        'otherLongitude',
        'otherLatitude',
        'otherCity',
        'otherPostcode',
        'adeli',
        'description',
        'email',
        'languages',
        'phone',
        'website',
        'appointmentLink',
        'useFirstNames',
        'useLastName',
        'diploma',
        'diplomaYear',
      ]);
    });
  });
});
