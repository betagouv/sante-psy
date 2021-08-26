import chai, { expect } from 'chai';
import sinon from 'sinon';
import app from '../../index';
import clean from '../helper/clean';
import dbPsychologists from '../../db/psychologists';
import { DossierState } from '../../types/DossierState';

const getAddrCoordinates = require('../../services/getAddrCoordinates');

const LONGITUDE_PARIS = 2.3488;
const LATITUDE_PARIS = 48.85341;
const LONGITUDE_MARSEILLE = 5.38107;
const LATITUDE_MARSEILLE = 43.29695;
const LONGITUDE_LYON = 4.84671;
const LATITUDE_LYON = 45.74846;
const LONGITUDE_NICE = 7.26608;
const LATITUDE_NICE = 43.70313;

describe.only('psyListingController', () => {
  let getAddrCoordinatesStub;
  let psyInParis;
  let psyInLyon;
  let psyInMarseille;
  let psyWithoutLoc;
  let psyInactive;
  let psyArchived;

  before(async () => {
    await clean.cleanAllPsychologists();

    psyInParis = clean.getOnePsyForListing(
      'paris@beta.gouv.fr',
      'Martin',
      'Pierre',
      false,
      "rue de l'Eglise 75000 Paris",
      '75 - Paris',
      'Ile-de-France',
      LONGITUDE_PARIS,
      LATITUDE_PARIS,
    );
    psyInLyon = clean.getOnePsyForListing(
      'lyon@beta.gouv.fr',
      'Bernard',
      'Jeanne',
      true,
      'rue de la gare 69000 Lyon',
      '69 - Rhône',
      'Auvergne-Rhône-Alpes',
      LONGITUDE_LYON,
      LATITUDE_LYON,
    );
    psyInMarseille = clean.getOnePsyForListing(
      'marseille@beta.gouv.fr',
      'Thomas',
      'Bernard',
      false,
      'rue des écoles 13000 Marseille',
      '13 - Bouches-du-Rhône',
      "Provence-Alpes-Côte d'Azur",
      LONGITUDE_MARSEILLE,
      LATITUDE_MARSEILLE,
    );
    psyWithoutLoc = clean.getOnePsyForListing(
      'perdu@beta.gouv.fr',
      'Petit',
      'Monique',
      true,
      'rue de la mairie 23123 Perdu',
      '23 - Creuse',
      'Nouvelle Aquitaine',
      null,
      null,
    );
    psyInactive = clean.getOneInactivePsy();
    psyArchived = clean.getOnePsy('archived@beta.gouv.fr', DossierState.accepte, true);
    await dbPsychologists.upsertMany([psyInParis, psyInLyon, psyInMarseille, psyWithoutLoc, psyInactive, psyArchived]);
  });

  beforeEach(() => {
    getAddrCoordinatesStub = sinon.stub(getAddrCoordinates, 'default').returns({});
  });

  afterEach(() => {
    getAddrCoordinatesStub.restore();
  });

  describe('getReducedActive', () => {
    it('should return all active psy', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send();

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(4);
      const resDossierNumbers = res.body.map((p) => p.dossierNumber);
      expect(resDossierNumbers).to.have.members([
        psyInParis.dossierNumber,
        psyInLyon.dossierNumber,
        psyInMarseille.dossierNumber,
        psyWithoutLoc.dossierNumber,
      ]);
      expect(res.body[0]).to.have.all.keys([
        'dossierNumber',
        'firstNames',
        'lastName',
        'teleconsultation',
        'address',
        'departement',
        'region',
      ]);
    });

    it('should sanitize body request', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: true, addressFilter: '<script>console.log(123)</script>', teleconsultation: '123' });

      expect(res.status).to.equal(200);
      expect(res.body).to.be.empty;
    });

    it('should return only teleconsultation psy if teleconsultation is true', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: '', addressFilter: '', teleconsultation: true });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);
      const resDossierNumbers = res.body.map((p) => p.dossierNumber);
      expect(resDossierNumbers).to.have.members([
        psyInLyon.dossierNumber,
        psyWithoutLoc.dossierNumber,
      ]);
    });

    it('should return all active psy if teleconsultation is false', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: '', addressFilter: '', teleconsultation: false });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(4);
    });

    it('should return only psy with matching lastname', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: 'martin ', addressFilter: '', teleconsultation: false });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(1);
      expect(res.body[0].dossierNumber).to.equal(psyInParis.dossierNumber);
    });

    it('should return psy with matching firstname', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: 'Bernard', addressFilter: '', teleconsultation: false });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);
      const resDossierNumbers = res.body.map((p) => p.dossierNumber);
      expect(resDossierNumbers).to.have.members([
        psyInLyon.dossierNumber,
        psyInMarseille.dossierNumber,
      ]);
    });

    it('should return psy with matching lastname and firstname', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: 'Bernard Thomas', addressFilter: '', teleconsultation: false });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(1);
      expect(res.body[0].dossierNumber).to.equal(psyInMarseille.dossierNumber);
    });

    it('should return psy with matching firstname and lastname', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: 'Thomas Bernard', addressFilter: '', teleconsultation: false });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(1);
      expect(res.body[0].dossierNumber).to.equal(psyInMarseille.dossierNumber);
    });

    it('should return psy with matching address even if no localisation if address filter', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: '', addressFilter: 'Mairie', teleconsultation: false });

      expect(res.status).to.equal(200);
      expect(res.body[0].dossierNumber).to.equal(psyWithoutLoc.dossierNumber);

      sinon.assert.calledWith(getAddrCoordinatesStub, 'Mairie');
    });

    it('should return psy with matching department even if no localisation if address filter', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: '', addressFilter: 'Creuse', teleconsultation: false });

      expect(res.status).to.equal(200);
      expect(res.body[0].dossierNumber).to.equal(psyWithoutLoc.dossierNumber);

      sinon.assert.calledWith(getAddrCoordinatesStub, 'Creuse');
    });

    it('should return psy with matching region even if no localisation if address filter', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: '', addressFilter: 'Aquitaine', teleconsultation: false });

      expect(res.status).to.equal(200);
      expect(res.body[0].dossierNumber).to.equal(psyWithoutLoc.dossierNumber);

      sinon.assert.calledWith(getAddrCoordinatesStub, 'Aquitaine');
    });

    it('should return only psy with matching department if address filter is department number', async () => {
      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: '', addressFilter: '13', teleconsultation: false });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(1);
      expect(res.body[0].dossierNumber).to.equal(psyInMarseille.dossierNumber);

      sinon.assert.notCalled(getAddrCoordinatesStub);
    });

    it('should return all psy ordered by distance if address filter', async () => {
      getAddrCoordinatesStub.returns({ longitude: LONGITUDE_NICE, latitude: LATITUDE_NICE });

      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: '', addressFilter: 'Nice', teleconsultation: false });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(4);
      const resDossierNumbers = res.body.map((p) => p.dossierNumber);
      expect(resDossierNumbers).to.have.ordered.members([
        psyInMarseille.dossierNumber,
        psyInLyon.dossierNumber,
        psyInParis.dossierNumber,
        psyWithoutLoc.dossierNumber,
      ]);

      sinon.assert.calledWith(getAddrCoordinatesStub, 'Nice');
    });

    it('should return psy matching teleconsultation and ordered by distance', async () => {
      getAddrCoordinatesStub.returns({ longitude: LONGITUDE_NICE, latitude: LATITUDE_NICE });

      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: '', addressFilter: 'Nice', teleconsultation: true });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);
      const resDossierNumbers = res.body.map((p) => p.dossierNumber);
      expect(resDossierNumbers).to.have.ordered.members([
        psyInLyon.dossierNumber,
        psyWithoutLoc.dossierNumber,
      ]);

      sinon.assert.calledWith(getAddrCoordinatesStub, 'Nice');
    });

    it('should return psy matching name and ordered by distance', async () => {
      getAddrCoordinatesStub.returns({ longitude: LONGITUDE_NICE, latitude: LATITUDE_NICE });

      const res = await chai.request(app)
        .post('/api/trouver-un-psychologue/reduced')
        .send({ nameFilter: 'bernard', addressFilter: 'nice', teleconsultation: false });

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(2);
      const resDossierNumbers = res.body.map((p) => p.dossierNumber);
      expect(resDossierNumbers).to.have.ordered.members([
        psyInMarseille.dossierNumber,
        psyInLyon.dossierNumber,
      ]);

      sinon.assert.calledWith(getAddrCoordinatesStub, 'nice');
    });
  });

  describe('getFullActive', () => {
    it('should return all active psy', async () => {
      const res = await chai.request(app)
        .get('/api/trouver-un-psychologue');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.length(4);
      const resDossierNumbers = res.body.map((p) => p.dossierNumber);
      expect(resDossierNumbers).to.have.members([
        psyInParis.dossierNumber,
        psyInLyon.dossierNumber,
        psyInMarseille.dossierNumber,
        psyWithoutLoc.dossierNumber,
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
      ]);
    });
  });
});
