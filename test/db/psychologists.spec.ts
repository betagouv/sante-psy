import { assert, expect } from 'chai';
import sinon from 'sinon';

import dbUniversities from '../../db/universities';
import dbPsychologists from '../../db/psychologists';
import dbSuspensionReasons from '../../db/suspensionReasons';
import clean from '../helper/clean';
import { DossierState } from '../../types/DossierState';

import dotEnv from 'dotenv';

const getAddressCoordinates = require('../../services/getAddressCoordinates');

dotEnv.config();

const LONGITUDE_PARIS = 2.3488;
const LATITUDE_PARIS = 48.85341;
const LONGITUDE_MARSEILLE = 5.38107;
const LATITUDE_MARSEILLE = 43.29695;

describe('DB Psychologists', () => {
  let getAddressCoordinatesStub;

  beforeEach(async () => {
    await clean.cleanAllUniversities();
    getAddressCoordinatesStub = sinon.stub(getAddressCoordinates, 'default').returns(null);
  });

  afterEach(async () => {
    getAddressCoordinatesStub.restore();
  });

  describe('upsertMany', () => {
    it('should insert one psychologist in PG', async () => {
      const psy = clean.getOnePsy();
      await dbPsychologists.upsertMany([psy]);

      const savedPsy = await dbPsychologists.getById(psy.dossierNumber);
      const exist = (savedPsy !== undefined);
      exist.should.be.equal(true);
    });

    it('should update one psychologist in PG', async () => {
      // doing a classic insert
      const psy = clean.getOnePsy();
      await dbPsychologists.upsertMany([psy]);

      const psyInsert = await dbPsychologists.getById(psy.dossierNumber);
      assert.isNull(psyInsert.updatedAt);

      // we do it twice in a row to update it (field updatedAt will change)
      await dbPsychologists.upsertMany([psy]);
      const psyUpsert = await dbPsychologists.getById(psy.dossierNumber);
      assert.isNotNull(psyUpsert.updatedAt);
    });

    it('should update psy if not self modified', async () => {
      const psyDS = clean.getOnePsy();

      // First save psy from DS
      await dbPsychologists.upsertMany([psyDS]);
      const psySPE = await dbPsychologists.getById(psyDS.dossierNumber);
      assert.isNotTrue(psySPE.selfModified);
      assert.isNull(psySPE.updatedAt);
      psySPE.firstNames.should.be.equal(psyDS.firstNames);
      psySPE.region.should.be.equal(psyDS.region);

      // Update from DS (new firstname and new region)
      const newPsyDS = { ...psyDS };
      newPsyDS.firstNames = 'New firstname';
      newPsyDS.region = 'Bretagne';
      await dbPsychologists.upsertMany([newPsyDS]);

      // Assert that data changed are modified in SPE DB
      const updatedPsySPE = await dbPsychologists.getById(psyDS.dossierNumber);
      updatedPsySPE.firstNames.should.be.equal('New firstname');
      updatedPsySPE.region.should.be.equal('Bretagne');
      assert.isFalse(updatedPsySPE.selfModified);
    });

    it('should not update region if self modified', async () => {
      const psyDS = clean.getOnePsy();

      // First save psy from DS
      await dbPsychologists.upsertMany([psyDS]);
      const psySPE = await dbPsychologists.getById(psyDS.dossierNumber);
      assert.isFalse(psySPE.selfModified);
      assert.isNull(psySPE.updatedAt);
      psySPE.firstNames.should.be.equal(psyDS.firstNames);
      psySPE.region.should.be.equal(psyDS.region);

      // Update psy in SPE
      psyDS.region = 'Bretagne';
      const nbUpdated = await dbPsychologists.update(psyDS);
      nbUpdated.should.be.equal(1);

      await dbPsychologists.upsertMany([psyDS]);

      // Assert that data didn't changed in SPE DB
      const updatedPsySPE = await dbPsychologists.getById(psyDS.dossierNumber);
      updatedPsySPE.selfModified.should.be.eql(true);
      updatedPsySPE.region.should.be.equal(psyDS.region);
    });

    it('should still update firstname if self modified', async () => {
      const psyDS = clean.getOnePsy();

      // First save psy from DS
      await dbPsychologists.upsertMany([psyDS]);
      const psySPE = await dbPsychologists.getById(psyDS.dossierNumber);
      assert.isFalse(psySPE.selfModified);
      assert.isNull(psySPE.updatedAt);
      psySPE.firstNames.should.be.equal(psyDS.firstNames);

      // Update psy in SPE
      const nbUpdated = await dbPsychologists.update(psyDS);
      nbUpdated.should.be.equal(1);

      // Update from DS (new firstname)
      const newPsyDS = { ...psyDS };
      newPsyDS.firstNames = 'New firstname';
      await dbPsychologists.upsertMany([newPsyDS]);

      // Assert that data changed are modified in SPE DB
      const updatedPsySPE = await dbPsychologists.getById(psyDS.dossierNumber);
      updatedPsySPE.selfModified.should.eql(true);
      updatedPsySPE.firstNames.should.be.equal(newPsyDS.firstNames);
    });

    it('should set coordinates when inserting psychologist in PG', async () => {
      const psy = clean.getOnePsy();
      getAddressCoordinatesStub.returns({ longitude: LONGITUDE_PARIS, latitude: LATITUDE_PARIS });

      await dbPsychologists.upsertMany([psy]);

      const savedPsy = await dbPsychologists.getById(psy.dossierNumber);
      savedPsy.should.exist;
      savedPsy.longitude.should.be.equal(LONGITUDE_PARIS);
      savedPsy.latitude.should.be.equal(LATITUDE_PARIS);
    });

    it('should update psy coordinates if address changed', async () => {
      getAddressCoordinatesStub
        .onFirstCall().returns({ longitude: LONGITUDE_PARIS, latitude: LATITUDE_PARIS })
        .onSecondCall().returns({ longitude: LONGITUDE_MARSEILLE, latitude: LATITUDE_MARSEILLE });

      // First save psy from DS
      const psyDS = clean.getOnePsy();
      await dbPsychologists.upsertMany([psyDS]);
      const psySPE = await dbPsychologists.getById(psyDS.dossierNumber);
      psySPE.address.should.be.equal(psyDS.address);
      psySPE.longitude.should.be.equal(LONGITUDE_PARIS);
      psySPE.latitude.should.be.equal(LATITUDE_PARIS);

      // Update from DS (new address)
      const newPsyDS = { ...psyDS };
      newPsyDS.address = '1 rue du Pôle Nord';
      await dbPsychologists.upsertMany([newPsyDS]);

      // Assert that data changed are modified in SPE DB
      const updatedPsySPE = await dbPsychologists.getById(psyDS.dossierNumber);
      updatedPsySPE.address.should.be.equal('1 rue du Pôle Nord');
      updatedPsySPE.longitude.should.be.equal(LONGITUDE_MARSEILLE);
      updatedPsySPE.latitude.should.be.equal(LATITUDE_MARSEILLE);
    });
  });

  describe('countByArchivedAndState', () => {
    it('should return the number of elements in the psychologists table', async () => {
      const shouldBeZero = await dbPsychologists.countByArchivedAndState();
      shouldBeZero.should.have.length(0);

      const psy = clean.getOnePsy();
      await dbPsychologists.upsertMany([psy]);
      const shouldBeOne = await dbPsychologists.countByArchivedAndState();
      shouldBeOne[0].count.should.be.equal('1');
      shouldBeOne[0].archived.should.be.equal(psy.archived);
      shouldBeOne[0].state.should.be.equal(psy.state);
    });
  });

  describe('getAllActive', () => {
    it('should only return not archived and accepted psychologists', async () => {
      const activePsy = clean.getOnePsy();
      const archivedPsy = clean.getOnePsy('archived@psy.fr');
      archivedPsy.archived = true;
      archivedPsy.lastName = 'ArchivedPsy';
      const constructionPsy = clean.getOnePsy('construction@psy.fr');
      constructionPsy.state = DossierState.enConstruction;
      constructionPsy.lastName = 'ConstructionPsy';
      const inactivePsy = clean.getOneInactivePsy(new Date());
      await dbPsychologists.upsertMany([activePsy, archivedPsy, constructionPsy, inactivePsy]);

      const shouldBeOne = await dbPsychologists.getAllActive();
      shouldBeOne.length.should.be.equal(1);
    });
  });

  describe('getAllAccepted', () => {
    it('should return only one selected data from accepted psychologists', async () => {
      const acceptedPsy = clean.getOnePsy();
      const archivedPsy = clean.getOnePsy();
      archivedPsy.archived = true;
      archivedPsy.lastName = 'ArchivedPsy';
      archivedPsy.personalEmail = 'loginemail-archived@beta.gouv.fr';
      archivedPsy.dossierNumber = '34e6352f-bdd0-48ce-83de-8de71cad295b';
      const constructionPsy = clean.getOnePsy();
      constructionPsy.state = DossierState.enConstruction;
      constructionPsy.lastName = 'ConstructionPsy';
      constructionPsy.dossierNumber = 'a2e447cd-2d57-4f83-8884-ab05a2633644';

      await dbPsychologists.upsertMany([acceptedPsy, archivedPsy, constructionPsy]);

      const result = await dbPsychologists.getAllAccepted(['personalEmail']);
      expect(result).to.have.length(2);
      expect(result[0]).to.have.all.keys('personalEmail');
      expect(result[1]).to.have.all.keys('personalEmail');
      expect(result[0].personalEmail).to.be.oneOf([acceptedPsy.personalEmail, archivedPsy.personalEmail]);
      expect(result[1].personalEmail).to.be.oneOf([acceptedPsy.personalEmail, archivedPsy.personalEmail]);
      expect(result[0].personalEmail).to.not.be.eql(result[1].personalEmail);
    });

    it('should return only multiple selected data from accepted psychologists', async () => {
      const psy = await clean.insertOnePsy();

      const result = await dbPsychologists.getAllAccepted(['personalEmail',
        'dossierNumber',
        'assignedUniversityId']);
      expect(result).to.have.length(1);
      expect(result[0]).to.have.all.keys('personalEmail',
        'dossierNumber',
        'assignedUniversityId');
      expect(result[0].personalEmail).to.eql(psy.personalEmail);
      expect(result[0].dossierNumber).to.eql(psy.dossierNumber);
      expect(result[0].assignedUniversityId).to.eql(psy.assignedUniversityId);
    });
  });

  describe('getAcceptedByEmail', () => {
    it('should return a psy if we enter a known login email', async () => {
      const psy = await clean.insertOnePsy();
      const result = await dbPsychologists.getAcceptedByEmail(psy.personalEmail);
      result.email.should.be.equal(psy.email);
      result.personalEmail.should.be.equal(psy.personalEmail);
    });

    it('should return a psy if we enter a known login email capitalized', async () => {
      const psy = await clean.insertOnePsy();
      const result = await dbPsychologists.getAcceptedByEmail(psy.personalEmail.toUpperCase());
      result.email.should.be.equal(psy.email);
      result.personalEmail.should.be.equal(psy.personalEmail);
    });

    it('should return undefined if we enter a unknown email', async () => {
      const unknownPsy = await dbPsychologists.getAcceptedByEmail('unknown@unknown.org');

      assert.isUndefined(unknownPsy);
    });

    it("should return undefined if we dont use 'personalEmail' but 'email' as the login", async () => {
      const psy = await clean.insertOnePsy();
      const unknownPsy = await dbPsychologists.getAcceptedByEmail(psy.email);
      assert.isUndefined(unknownPsy);
    });

    it('should return undefined if known email but not accepte state', async () => {
      const psy = await clean.insertOnePsy('loginemail@beta.gouv.fr', DossierState.sansSuite);
      const unknownPsy = await dbPsychologists.getAcceptedByEmail(psy.personalEmail);
      assert.isUndefined(unknownPsy);
    });

    it('should return undefined if known email but enConstruction state', async () => {
      const psy = await clean.insertOnePsy('loginemail@beta.gouv.fr', DossierState.enConstruction);
      const unknownPsy = await dbPsychologists.getAcceptedByEmail(psy.personalEmail);
      assert.isUndefined(unknownPsy);
    });

    it('should return undefined if known email but enInstruction state', async () => {
      const psy = await clean.insertOnePsy('loginemail@beta.gouv.fr', DossierState.enInstruction);
      const unknownPsy = await dbPsychologists.getAcceptedByEmail(psy.personalEmail);
      assert.isUndefined(unknownPsy);
    });

    it('should return undefined if known email but refusé state', async () => {
      const psy = await clean.insertOnePsy('loginemail@beta.gouv.fr', DossierState.refuse);
      const unknownPsy = await dbPsychologists.getAcceptedByEmail(psy.personalEmail);
      assert.isUndefined(unknownPsy);
    });
  });

  describe('getNotYetAcceptedByEmail', () => {
    it('should return a psy if we enter a known login email enConstruction', async () => {
      const psy = await clean.insertOnePsy('loginemail@beta.gouv.fr', DossierState.enConstruction);
      const result = await dbPsychologists.getNotYetAcceptedByEmail(psy.personalEmail);
      result.email.should.be.equal(psy.email);
      result.personalEmail.should.be.equal(psy.personalEmail);
    });

    it('should return a psy if we enter a known login email enInstruction', async () => {
      const psy = await clean.insertOnePsy('loginemail@beta.gouv.fr', DossierState.enInstruction);
      const result = await dbPsychologists.getNotYetAcceptedByEmail(psy.personalEmail);
      result.email.should.be.equal(psy.email);
      result.personalEmail.should.be.equal(psy.personalEmail);
    });

    it('should return undefined if we enter a known login email accepted', async () => {
      const psy = await clean.insertOnePsy('loginemail@beta.gouv.fr', DossierState.accepte);
      const result = await dbPsychologists.getNotYetAcceptedByEmail(psy.personalEmail);
      assert.isUndefined(result);
    });
  });

  describe('updateConventionInfo', () => {
    it('should update conventionInfo', async () => {
      const univName = 'Fake Uni';
      const university = await dbUniversities.insertByName(univName);
      const psy = await clean.insertOnePsy();
      const savedPsy = await dbPsychologists.getAcceptedByEmail(psy.personalEmail);
      // Check that fields are not set pre-test
      expect(savedPsy.isConventionSigned).not.to.exist;
      expect(savedPsy.assignedUniversityId).to.not.equal(university.id);

      await dbPsychologists.updateConventionInfo(
        savedPsy.dossierNumber,
        university.id,
        true, // isConventionSigned
      );

      const updatedPsy = await dbPsychologists.getAcceptedByEmail(psy.personalEmail);

      expect(updatedPsy.isConventionSigned).to.equal(true);
      expect(updatedPsy.assignedUniversityId).to.equal(university.id);
    });

    it('should not update conventionInfo if psychologistId is unknown', async () => {
      const univUUID = '736bd860-3928-457e-9f40-3f367c36be30';
      const unknownPsyId = '390e285c-ed4a-4ce4-ac30-59bb3adf0675';

      try {
        await dbPsychologists.updateConventionInfo(
          unknownPsyId,
          univUUID,
          true, // isConventionSigned
        );
        expect.fail('updateConventionInfo should have thrown error');
      } catch (err) {
        // pass
      }
    });
  });

  describe('getConventionInfo', () => {
    it('should return assignedUniID, name and signedConvention,', async () => {
      const univName = 'Fake Uni';
      const university = await dbUniversities.insertByName(univName);
      const isConventionSigned = true;
      const psy = clean.getOnePsy('loginemail@beta.gouv.fr', DossierState.accepte, false, university.id);
      await dbPsychologists.upsertMany([psy]);
      const savedPsy = await dbPsychologists.getAcceptedByEmail(psy.personalEmail);

      await dbPsychologists.updateConventionInfo(
        savedPsy.dossierNumber,
        university.id,
        isConventionSigned, // isConventionSigned
      );

      const currentConvention = await dbPsychologists.getConventionInfo(savedPsy.dossierNumber);
      expect(currentConvention.isConventionSigned).to.equal(isConventionSigned);
      expect(currentConvention.universityId).to.equal(university.id);
      expect(currentConvention.universityName).to.equal(univName);
    });

    it('should return undefined if no university is linked to the psy', async () => {
      const psy = clean.getOnePsy('loginemail@beta.gouv.fr', DossierState.accepte, false, null);
      await dbPsychologists.upsertMany([psy]);
      const savedPsy = await dbPsychologists.getAcceptedByEmail(psy.personalEmail);

      const currentConvention = await dbPsychologists.getConventionInfo(savedPsy.dossierNumber);

      expect(currentConvention).to.equal(undefined);
      expect(currentConvention).to.equal(undefined);
    });
  });

  describe('saveAssignedUniversity', () => {
    it('should update assignedUniversityId', async () => {
      const univName = 'Fake Uni';
      const university = await dbUniversities.insertByName(univName);
      const psy = clean.getOnePsy('loginemail@beta.gouv.fr', DossierState.accepte, false, null);
      await dbPsychologists.upsertMany([psy]);
      const savedPsy = await dbPsychologists.getAcceptedByEmail(psy.personalEmail);
      // Check that fields are not set pre-test
      expect(savedPsy.assignedUniversityId).to.not.equal(university.id);

      await dbPsychologists.saveAssignedUniversity(
        savedPsy.dossierNumber,
        university.id,
      );

      const updatedPsy = await dbPsychologists.getAcceptedByEmail(psy.personalEmail);

      expect(updatedPsy.assignedUniversityId).to.equal(university.id);
    });

    it('should not update assignedUniversityId if psychologistId is unknown', async () => {
      const univUUID = '736bd860-3928-457e-9f40-3f367c36be30';
      const unknownPsyId = '390e285c-ed4a-4ce4-ac30-59bb3adf0675';

      try {
        await dbPsychologists.saveAssignedUniversity(
          unknownPsyId,
          univUUID,
        );
        expect.fail('saveAssignedUniversity should have thrown error');
      } catch (err) {
        // pass
      }
    });
  });

  describe('getById', () => {
    it('should return undefined if does not exist', async () => {
      const unknownPsyId = '390e285c-ed4a-4ce4-ac30-59bb3adf0123';

      const returnedPsy = await dbPsychologists.getById(unknownPsyId);

      expect(returnedPsy).to.be.undefined;
    });

    it('should return psychologist if exists', async () => {
      const psy = clean.getOnePsy();
      await dbPsychologists.upsertMany([psy]);

      const returnedPsy = await dbPsychologists.getById(psy.dossierNumber);

      expect(returnedPsy).to.exist;
      expect(returnedPsy.email).to.eql(psy.email);
    });
  });

  describe('update', () => {
    it('should do nothing if psychologist does not exist', async () => {
      const psy = clean.getOnePsy();

      const nbUpdated = await dbPsychologists.update(psy);
      nbUpdated.should.be.equal(0);
    });

    it('should update psychologist if exist', async () => {
      const psy = clean.getOnePsy();
      await dbPsychologists.upsertMany([psy]);
      expect(psy.updatedAt).to.be.undefined;

      const newEmail = 'new@email.fr';
      psy.email = newEmail;
      const nbUpdated = await dbPsychologists.update(psy);
      nbUpdated.should.be.equal(1);

      const updatedPsy = await dbPsychologists.getById(psy.dossierNumber);
      expect(updatedPsy.email).to.equal(newEmail);
      expect(updatedPsy.updatedAt).to.not.be.null;
      expect(updatedPsy.selfModified).to.be.true;
    });
  });

  describe('activate', () => {
    it('should activate psy and remove inactiveUntil date', async () => {
      const inactivePsy = clean.getOneInactivePsy(new Date());
      await dbPsychologists.upsertMany([inactivePsy]);

      await dbPsychologists.activate(inactivePsy.dossierNumber);

      const psy = await dbPsychologists.getById(inactivePsy.dossierNumber);
      psy.active.should.be.equal(true);
      psy.selfModified.should.be.equal(false);
      assert.isNull(psy.inactiveUntil);
    });
  });

  describe('suspend', () => {
    it('should suspend psy', async () => {
      const activePsy = clean.getOnePsy();
      await dbPsychologists.upsertMany([activePsy]);

      const now = new Date();
      const date = new Date();
      date.setDate(date.getDate() + 50);
      date.setHours(0, 0, 0, 0);

      await dbPsychologists.suspend(activePsy.dossierNumber, date, 'because i say so');

      const psy = await dbPsychologists.getById(activePsy.dossierNumber);
      psy.active.should.be.equal(false);
      psy.selfModified.should.be.equal(false);
      psy.inactiveUntil.should.be.eql(date);

      const reasons = await dbSuspensionReasons.getByPsychologist(activePsy.dossierNumber);
      reasons.length.should.be.equal(1);
      reasons[0].reason.should.be.equal('because i say so');
      reasons[0].until.getFullYear().should.be.equal(date.getFullYear());
      reasons[0].until.getMonth().should.be.equal(date.getMonth());
      reasons[0].until.getDate().should.be.equal(date.getDate());
      reasons[0].createdAt.should.be.at.least(now);
      reasons[0].createdAt.should.be.at.most(new Date());
    });
  });

  describe('reactivate', () => {
    it('should reactivate inactive psy with until date before now', async () => {
      const activePsy = clean.getOnePsy();
      const now = new Date();
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      const inactivePsy1 = clean.getOneInactivePsy(yesterday);
      const inactivePsy2 = clean.getOneInactivePsy(now);
      const inactivePsy3 = clean.getOneInactivePsy(tomorrow);
      await dbPsychologists.upsertMany([activePsy, inactivePsy1, inactivePsy2, inactivePsy3]);

      await dbPsychologists.reactivate();

      let psy = await dbPsychologists.getById(activePsy.dossierNumber);
      psy.active.should.be.equal(true);
      psy.selfModified.should.be.equal(false);
      assert.isNull(psy.inactiveUntil);

      psy = await dbPsychologists.getById(inactivePsy1.dossierNumber);
      psy.active.should.be.equal(true);
      psy.selfModified.should.be.equal(false);
      assert.isNull(psy.inactiveUntil);

      psy = await dbPsychologists.getById(inactivePsy2.dossierNumber);
      psy.active.should.be.equal(true);
      psy.selfModified.should.be.equal(false);
      assert.isNull(psy.inactiveUntil);

      tomorrow.setHours(0, 0, 0, 0);
      psy = await dbPsychologists.getById(inactivePsy3.dossierNumber);
      psy.active.should.be.equal(false);
      psy.selfModified.should.be.equal(false);
      psy.inactiveUntil.should.be.eql(tomorrow);
    });
  });
});
