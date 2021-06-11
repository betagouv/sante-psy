const { assert } = require('chai');
const rewire = require('rewire');
const { v4: uuidV4 } = require('uuid');
require('dotenv').config();

const dbPsychologists = rewire('../db/psychologists');
const dbUniversities = rewire('../db/universities');
const { DOSSIER_STATE } = require('../utils/dossierState');
const { default: dbSuspensionReasons } = require('../db/suspensionReasons');
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');
const { expect } = require('chai');
const { fail } = require('chai');
const clean = require('./helper/clean');

describe('DB Psychologists', () => {
  const psyList = clean.psyList();

  afterEach(async () => {
    await clean.cleanAllPsychologists();
    await clean.cleanAllUniversities();
  });

  describe('savePsychologistInPG', () => {
    it('should INsert one psychologist in PG', async () => {
      await dbPsychologists.savePsychologistInPG(psyList);

      const psy = await dbPsychologists.getPsychologistById(psyList[0].dossierNumber);
      const exist = (psy !== undefined);
      exist.should.be.equal(true);
    });

    it('should update one psychologist in PG', async () => {
      // doing a classic insert
      await dbPsychologists.savePsychologistInPG(psyList);
      const psyInsert = await dbPsychologists.getPsychologistById(psyList[0].dossierNumber);
      assert.isNull(psyInsert.updatedAt);

      // we do it twice in a row to update it (field updatedAt will change)
      await dbPsychologists.savePsychologistInPG(psyList);
      const psyUpsert = await dbPsychologists.getPsychologistById(psyList[0].dossierNumber);
      assert.isNotNull(psyUpsert.updatedAt);
    });

    it('should update psy if not self modified', async () => {
      const psyDS = psyList[0];

      // First save psy from DS
      await dbPsychologists.savePsychologistInPG([psyDS]);
      const psySPE = await dbPsychologists.getPsychologistById(psyDS.dossierNumber);
      assert.isNotTrue(psySPE.selfModified);
      assert.isNull(psySPE.updatedAt);
      psySPE.firstNames.should.be.equal(psyDS.firstNames);
      psySPE.region.should.be.equal('Normandie');

      // Update from DS (new firstname and new region)
      const newPsyDS = { ...psyDS };
      newPsyDS.firstNames = 'New firstname';
      newPsyDS.region = 'Bretagne';
      await dbPsychologists.savePsychologistInPG([newPsyDS]);

      // Assert that data changed are modified in SPE DB
      const updatedPsySPE = await dbPsychologists.getPsychologistById(psyDS.dossierNumber);
      updatedPsySPE.firstNames.should.be.equal('New firstname');
      updatedPsySPE.region.should.be.equal('Bretagne');
      assert.isFalse(updatedPsySPE.selfModified);
    });

    it('should not update region if self modified', async () => {
      const psyDS = psyList[0];

      // First save psy from DS
      await dbPsychologists.savePsychologistInPG([psyDS]);
      const psySPE = await dbPsychologists.getPsychologistById(psyDS.dossierNumber);
      assert.isFalse(psySPE.selfModified);
      assert.isNull(psySPE.updatedAt);
      psySPE.firstNames.should.be.equal(psyDS.firstNames);
      psySPE.region.should.be.equal('Normandie');

      // Update psy in SPE
      psyDS.region = 'Bretagne';
      const nbUpdated = await dbPsychologists.updatePsychologist(psyDS);
      nbUpdated.should.be.equal(1);

      // Update from DS (region : Normandie)
      await dbPsychologists.savePsychologistInPG([psyDS]);

      // Assert that data didn't changed in SPE DB
      const updatedPsySPE = await dbPsychologists.getPsychologistById(psyDS.dossierNumber);
      updatedPsySPE.selfModified.should.be.true;
      updatedPsySPE.region.should.be.equal(psyDS.region);
    });

    it('should still update firstname if self modified', async () => {
      const psyDS = psyList[0];

      // First save psy from DS
      await dbPsychologists.savePsychologistInPG([psyDS]);
      const psySPE = await dbPsychologists.getPsychologistById(psyDS.dossierNumber);
      assert.isFalse(psySPE.selfModified);
      assert.isNull(psySPE.updatedAt);
      psySPE.firstNames.should.be.equal(psyDS.firstNames);

      // Update psy in SPE
      const nbUpdated = await dbPsychologists.updatePsychologist(psyDS);
      nbUpdated.should.be.equal(1);

      // Update from DS (new firstname)
      const newPsyDS = { ...psyDS };
      newPsyDS.firstNames = 'New firstname';
      await dbPsychologists.savePsychologistInPG([newPsyDS]);

      // Assert that data changed are modified in SPE DB
      const updatedPsySPE = await dbPsychologists.getPsychologistById(psyDS.dossierNumber);
      updatedPsySPE.selfModified.should.be.true;
      updatedPsySPE.firstNames.should.be.equal(newPsyDS.firstNames);
    });
  });

  describe('getNumberOfPsychologists', () => {
    it('should return the number of elements in the psychologists table', async () => {
      const shouldBeZero = await dbPsychologists.getNumberOfPsychologists();
      shouldBeZero.should.have.length(0);

      await dbPsychologists.savePsychologistInPG(psyList);
      const shouldBeOne = await dbPsychologists.getNumberOfPsychologists();
      shouldBeOne[0].count.should.be.equal('1');
      shouldBeOne[0].archived.should.be.equal(psyList[0].archived);
      shouldBeOne[0].state.should.be.equal(psyList[0].state);
    });
  });

  describe('addFrenchLanguageIfMissing', () => {
    const addFrenchLanguageIfMissing = dbPsychologists.__get__('addFrenchLanguageIfMissing');
    it('should add french if missing with one language', async () => {
      addFrenchLanguageIfMissing('espagnol').should.equal('Français, espagnol');
    });

    it('should add french if nothing there', async () => {
      addFrenchLanguageIfMissing('').should.equal('Français');
    });

    it('should add french if empty spaces for languages', async () => {
      addFrenchLanguageIfMissing('    ').should.equal('Français');
    });

    it('should not add french if already there', async () => {
      addFrenchLanguageIfMissing('français, italien').should.equal('français, italien');
    });

    it("should not add french if 'francais' is there", async () => {
      addFrenchLanguageIfMissing('francais').should.equal('francais');
    });

    it('should not add french (capitalized) if already there', async () => {
      addFrenchLanguageIfMissing('Français et espagnol').should.equal('Français et espagnol');
    });
  });

  describe('getActivePsychologists', () => {
    it('should only return not archived and accepte psychologists with capitalized lastName', async () => {
      const archivedPsy = { ...psyList[0] };
      archivedPsy.archived = true;
      archivedPsy.lastName = 'ArchivedPsy';
      archivedPsy.dossierNumber = '34e6352f-bdd0-48ce-83de-8de71cad295b';
      const constructionPsy = { ...psyList[0] };
      constructionPsy.state = 'en_construction';
      constructionPsy.lastName = 'ConstructionPsy';
      constructionPsy.dossierNumber = 'a2e447cd-2d57-4f83-8884-ab05a2633644';
      const unactivePsy = { ...psyList[0] };
      unactivePsy.active = false;
      unactivePsy.dossierNumber = 'c453be18-b989-4bff-8e29-f01e4b081406';

      await dbPsychologists.savePsychologistInPG([psyList[0], archivedPsy, constructionPsy, unactivePsy]);

      const shouldBeOne = await dbPsychologists.getActivePsychologists();
      shouldBeOne.length.should.be.equal(1);
      shouldBeOne[0].lastName.should.be.equal(psyList[0].lastName.toUpperCase());
      assert.isUndefined(shouldBeOne[0].loginEmail);
    });
  });

  describe('getAcceptedPsychologistByEmail', () => {
    it('should return a psy if we enter a known login email', async () => {
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail);
      psy.email.should.be.equal(psyList[0].email);
      psy.personalEmail.should.be.equal(psyList[0].personalEmail);
    });

    it('should return a psy if we enter a known login email capitalized', async () => {
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail.toUpperCase());
      psy.email.should.be.equal(psyList[0].email);
      psy.personalEmail.should.be.equal(psyList[0].personalEmail);
    });

    it('should return undefined if we enter a unknown email', async () => {
      const unknownPsy = await dbPsychologists.getAcceptedPsychologistByEmail('unknown@unknown.org');

      assert.isUndefined(unknownPsy);
    });

    it("should return undefined if we dont use 'personalEmail' but 'email' as the login", async () => {
      await dbPsychologists.savePsychologistInPG(psyList);
      const unknownPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].email);
      assert.isUndefined(unknownPsy);
    });

    it('should return undefined if known email but not accepte state', async () => {
      psyList[0].state = DOSSIER_STATE.sans_suite;
      await dbPsychologists.savePsychologistInPG(psyList);
      const unknownPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail);
      assert.isUndefined(unknownPsy);
    });

    it('should return undefined if known email but en_construction state', async () => {
      psyList[0].state = DOSSIER_STATE.en_construction;
      await dbPsychologists.savePsychologistInPG(psyList);
      const unknownPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail);
      assert.isUndefined(unknownPsy);
    });

    it('should return undefined if known email but en_instruction state', async () => {
      psyList[0].state = DOSSIER_STATE.en_instruction;
      await dbPsychologists.savePsychologistInPG(psyList);
      const unknownPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail);
      assert.isUndefined(unknownPsy);
    });

    it('should return undefined if known email but refusé state', async () => {
      psyList[0].state = DOSSIER_STATE.refuse;
      await dbPsychologists.savePsychologistInPG(psyList);
      const unknownPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail);
      assert.isUndefined(unknownPsy);
    });
  });

  describe('getPsychologistById', () => {
    it('should return a psy if we enter a known id', async () => {
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getPsychologistById(psyList[0].dossierNumber);
      psy.email.should.be.equal(psyList[0].email);
      psy.dossierNumber.should.be.equal(psyList[0].dossierNumber);
    });

    it('should return undefined if we enter a unknown id', async () => {
      const unknownPsy = await dbPsychologists.getPsychologistById(uuidV4());
      assert.isUndefined(unknownPsy);
    });
  });

  describe('getNotYetAcceptedPsychologistByEmail', () => {
    it('should return a psy if we enter a known login email en_construction', async () => {
      psyList[0].state = DOSSIER_STATE.en_construction;
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getNotYetAcceptedPsychologistByEmail(psyList[0].personalEmail);
      psy.email.should.be.equal(psyList[0].email);
      psy.personalEmail.should.be.equal(psyList[0].personalEmail);
    });

    it('should return a psy if we enter a known login email en_instruction', async () => {
      psyList[0].state = DOSSIER_STATE.en_instruction;
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getNotYetAcceptedPsychologistByEmail(psyList[0].personalEmail);
      psy.email.should.be.equal(psyList[0].email);
      psy.personalEmail.should.be.equal(psyList[0].personalEmail);
    });

    it('should return undefined if we enter a known login email accepted', async () => {
      psyList[0].state = DOSSIER_STATE.accepte;
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getNotYetAcceptedPsychologistByEmail(psyList[0].personalEmail);
      assert.isUndefined(psy);
    });
  });

  describe('updateConventionInfo', () => {
    it('should update conventionInfo', async () => {
      const univUUID = '736bd860-3928-457e-9f40-3f367c36be30';
      const psy = psyList[0];
      psy.state = DOSSIER_STATE.accepte;
      await dbPsychologists.savePsychologistInPG([psy]);
      const savedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psy.personalEmail);
      // Check that fields are not set pre-test
      expect(savedPsy.isConventionSigned).not.to.exist;
      expect(savedPsy.assignedUniversityId).to.not.equal(univUUID);

      await dbPsychologists.updateConventionInfo(
        savedPsy.dossierNumber,
        univUUID,
        true, // isConventionSigned
      );

      const updatedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psy.personalEmail);

      expect(updatedPsy.isConventionSigned).to.equal(true);
      expect(updatedPsy.assignedUniversityId).to.equal(univUUID);
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
        fail('updateConventionInfo should have thrown error');
      } catch (err) {
        // pass
      }
    });
  });

  describe('getConventionInfo', () => {
    it('should return assignedUniID, name and signedConvention,', async () => {
      const univName = 'Fake Uni';
      await dbUniversities.insertUniversity(univName);
      const universities = await dbUniversities.getUniversities();
      const univUUID = universities[0].id;
      const isConventionSigned = true;
      const psy = psyList[0];
      psy.state = DOSSIER_STATE.accepte;
      psy.assignedUniversityId = univUUID;
      await dbPsychologists.savePsychologistInPG([psy]);
      const savedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psy.personalEmail);

      await dbPsychologists.updateConventionInfo(
        savedPsy.dossierNumber,
        univUUID,
        isConventionSigned, // isConventionSigned
      );

      const currentConvention = await dbPsychologists.getConventionInfo(savedPsy.dossierNumber);
      expect(currentConvention.isConventionSigned).to.equal(isConventionSigned);
      expect(currentConvention.universityId).to.equal(univUUID);
      expect(currentConvention.universityName).to.equal(univName);
    });

    it('should return undefined if no university is linked to the psy', async () => {
      const psy = psyList[0];
      psy.state = DOSSIER_STATE.accepte;
      psy.assignedUniversityId = null;
      await dbPsychologists.savePsychologistInPG([psy]);
      const savedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psy.personalEmail);

      const currentConvention = await dbPsychologists.getConventionInfo(savedPsy.dossierNumber);

      expect(currentConvention).to.equal(undefined);
      expect(currentConvention).to.equal(undefined);
    });
  });

  describe('saveAssignedUniversity', () => {
    it('should update assignedUniversityId', async () => {
      const univUUID = '736bd860-3928-457e-9f40-3f367c36be30';
      const psy = psyList[0];
      psy.state = DOSSIER_STATE.accepte;
      await dbPsychologists.savePsychologistInPG([psy]);
      const savedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psy.personalEmail);
      // Check that fields are not set pre-test
      expect(savedPsy.assignedUniversityId).to.not.equal(univUUID);

      await dbPsychologists.saveAssignedUniversity(
        savedPsy.dossierNumber,
        univUUID,
      );

      const updatedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psy.personalEmail);

      expect(updatedPsy.assignedUniversityId).to.equal(univUUID);
    });

    it('should not update assignedUniversityId if psychologistId is unknown', async () => {
      const univUUID = '736bd860-3928-457e-9f40-3f367c36be30';
      const unknownPsyId = '390e285c-ed4a-4ce4-ac30-59bb3adf0675';

      try {
        await dbPsychologists.saveAssignedUniversity(
          unknownPsyId,
          univUUID,
        );
        fail('saveAssignedUniversity should have thrown error');
      } catch (err) {
        // pass
      }
    });
  });

  describe('getPsychologistById', () => {
    it('should return undefined if does not exist', async () => {
      const unknownPsyId = '390e285c-ed4a-4ce4-ac30-59bb3adf0123';

      const returnedPsy = await dbPsychologists.getPsychologistById(unknownPsyId);

      expect(returnedPsy).to.be.undefined;
    });

    it('should return psychologist if exists', async () => {
      const psy = psyList[0];
      await dbPsychologists.savePsychologistInPG([psy]);

      const returnedPsy = await dbPsychologists.getPsychologistById(psy.dossierNumber);

      expect(returnedPsy).to.exist;
      expect(returnedPsy.email).to.eql(psy.email);
    });
  });

  describe('updatePsychologist', () => {
    it('should do nothing if psychologist does not exist', async () => {
      const psy = psyList[0];
      psy.dossierNumber = '390e285c-ed4a-4ce4-ac30-59bb3adf0123'; // unknown
      psy.email = 'new@email.fr';

      const nbUpdated = await dbPsychologists.updatePsychologist(psy);
      nbUpdated.should.be.equal(0);
    });

    it('should update psychologist if exist', async () => {
      const psy = psyList[0];
      await dbPsychologists.savePsychologistInPG([psy]);
      expect(psy.updatedAt).to.be.undefined;

      const newEmail = 'new@email.fr';
      psy.email = newEmail;
      const nbUpdated = await dbPsychologists.updatePsychologist(psy);
      nbUpdated.should.be.equal(1);

      const updatedPsy = await dbPsychologists.getPsychologistById(psy.dossierNumber);
      expect(updatedPsy.email).to.equal(newEmail);
      expect(updatedPsy.updatedAt).to.not.be.undefined;
      expect(updatedPsy.selfModified).to.be.true;
    });
  });

  describe('activate', () => {
    it('should activate psy and remove unactiveUntil date', async () => {
      const unactivePsy = clean.getOneInactivePsy(new Date());
      await dbPsychologists.savePsychologistInPG([unactivePsy]);

      await dbPsychologists.activate(unactivePsy.dossierNumber);

      const psy = await dbPsychologists.getPsychologistById(unactivePsy.dossierNumber);
      psy.active.should.be.equal(true);
      psy.selfModified.should.be.equal(false);
      assert.isNull(psy.unactiveUntil);
    });
  });

  describe('suspend', () => {
    it('should supsend psy', async () => {
      const activePsy = clean.getOnePsy();
      await dbPsychologists.savePsychologistInPG([activePsy]);

      const now = new Date();
      const date = new Date();
      date.setDate(date.getDate() + 50);

      await dbPsychologists.suspend(activePsy.dossierNumber, date, 'because i say so');

      const psy = await dbPsychologists.getPsychologistById(activePsy.dossierNumber);
      psy.active.should.be.equal(false);
      psy.selfModified.should.be.equal(false);
      psy.unactiveUntil.should.be.eql(date);

      const reasons = await dbSuspensionReasons.getAllForPsychologist(activePsy.dossierNumber);
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
    it('should reactivate unactive psy with until date before now', async () => {
      const activePsy = clean.getOnePsy();
      const now = new Date();
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const tomorrow = new Date();
      tomorrow.setDate(now.getDate() + 1);
      const unactivePsy1 = clean.getOneInactivePsy(yesterday);
      const unactivePsy2 = clean.getOneInactivePsy(now);
      const unactivePsy3 = clean.getOneInactivePsy(tomorrow);
      await dbPsychologists.savePsychologistInPG([activePsy, unactivePsy1, unactivePsy2, unactivePsy3]);

      await dbPsychologists.reactivate();

      let psy = await dbPsychologists.getPsychologistById(activePsy.dossierNumber);
      psy.active.should.be.equal(true);
      psy.selfModified.should.be.equal(false);
      assert.isNull(psy.unactiveUntil);

      psy = await dbPsychologists.getPsychologistById(unactivePsy1.dossierNumber);
      psy.active.should.be.equal(true);
      psy.selfModified.should.be.equal(false);
      assert.isNull(psy.unactiveUntil);

      psy = await dbPsychologists.getPsychologistById(unactivePsy2.dossierNumber);
      psy.active.should.be.equal(true);
      psy.selfModified.should.be.equal(false);
      assert.isNull(psy.unactiveUntil);

      psy = await dbPsychologists.getPsychologistById(unactivePsy3.dossierNumber);
      psy.active.should.be.equal(false);
      psy.selfModified.should.be.equal(false);
      psy.unactiveUntil.should.be.eql(tomorrow);
    });
  });
});
