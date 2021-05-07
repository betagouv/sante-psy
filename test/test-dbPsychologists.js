const { assert } = require('chai');
const rewire = require('rewire');
require('dotenv').config();

const dbPsychologists = rewire('../db/psychologists');
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');
const { expect } = require('chai');
const { fail } = require('chai');
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);
const clean = require('./helper/clean');

describe('DB Psychologists', () => {
  const psyList = clean.psyList();

  async function testDataPsychologistsExist(dossierNumber) {
    const exist = await knex(dbPsychologists.psychologistsTable)
      .where('dossierNumber', dossierNumber)
      .first();

    return exist;
  }

  afterEach(async () => {
    await clean.cleanAllPsychologists();
  });

  describe('savePsychologistInPG', () => {
    it('should INsert one psychologist in PG', async () => {
      await dbPsychologists.savePsychologistInPG(psyList);

      const psy = await testDataPsychologistsExist(psyList[0].dossierNumber);
      const exist = (psy !== undefined);
      exist.should.be.equal(true);
    });

    it('should UPsert one psychologist in PG', async () => {
      // doing a classic insert
      await dbPsychologists.savePsychologistInPG(psyList);
      const psyInsert = await testDataPsychologistsExist(psyList[0].dossierNumber);
      assert.isNull(psyInsert.updatedAt);

      // we do it twice in a row to UPsert it (field updatedAt will change)
      await dbPsychologists.savePsychologistInPG(psyList);
      const psyUpsert = await testDataPsychologistsExist(psyList[0].dossierNumber);
      assert.isNotNull(psyUpsert.updatedAt);
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

  describe('getPsychologists', () => {
    it('should only return not archived and accepte psychologists with capitalized lastName', async () => {
      const archivedPsy = { ...psyList[0] };
      archivedPsy.archived = true;
      archivedPsy.lastName = 'ArchivedPsy';
      archivedPsy.dossierNumber = '34e6352f-bdd0-48ce-83de-8de71cad295b';
      const constructionPsy = { ...psyList[0] };
      constructionPsy.state = 'en_construction';
      constructionPsy.lastName = 'ConstructionPsy';
      constructionPsy.dossierNumber = 'a2e447cd-2d57-4f83-8884-ab05a2633644';

      await dbPsychologists.savePsychologistInPG([psyList[0], archivedPsy, constructionPsy]);

      const shouldBeOne = await dbPsychologists.getPsychologists();
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
      psyList[0].state = demarchesSimplifiees.DOSSIER_STATE.sans_suite;
      await dbPsychologists.savePsychologistInPG(psyList);
      const unknownPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail);
      assert.isUndefined(unknownPsy);
    });
    it('should return undefined if known email but en_construction state', async () => {
      psyList[0].state = demarchesSimplifiees.DOSSIER_STATE.en_construction;
      await dbPsychologists.savePsychologistInPG(psyList);
      const unknownPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail);
      assert.isUndefined(unknownPsy);
    });
    it('should return undefined if known email but en_instruction state', async () => {
      psyList[0].state = demarchesSimplifiees.DOSSIER_STATE.en_instruction;
      await dbPsychologists.savePsychologistInPG(psyList);
      const unknownPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail);
      assert.isUndefined(unknownPsy);
    });

    it('should return undefined if known email but refusé state', async () => {
      psyList[0].state = demarchesSimplifiees.DOSSIER_STATE.refuse;
      await dbPsychologists.savePsychologistInPG(psyList);
      const unknownPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psyList[0].personalEmail);
      assert.isUndefined(unknownPsy);
    });
  });

  describe('getNotYetAcceptedPsychologistByEmail', () => {
    it('should return a psy if we enter a known login email en_construction', async () => {
      psyList[0].state = demarchesSimplifiees.DOSSIER_STATE.en_construction;
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getNotYetAcceptedPsychologistByEmail(psyList[0].personalEmail);
      psy.email.should.be.equal(psyList[0].email);
      psy.personalEmail.should.be.equal(psyList[0].personalEmail);
    });

    it('should return a psy if we enter a known login email en_instruction', async () => {
      psyList[0].state = demarchesSimplifiees.DOSSIER_STATE.en_instruction;
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getNotYetAcceptedPsychologistByEmail(psyList[0].personalEmail);
      psy.email.should.be.equal(psyList[0].email);
      psy.personalEmail.should.be.equal(psyList[0].personalEmail);
    });

    it('should return undefined if we enter a known login email accepted', async () => {
      psyList[0].state = demarchesSimplifiees.DOSSIER_STATE.accepte;
      await dbPsychologists.savePsychologistInPG(psyList);
      const psy = await dbPsychologists.getNotYetAcceptedPsychologistByEmail(psyList[0].personalEmail);
      assert.isUndefined(psy);
    });
  });

  describe('updateConventionInfo', () => {
    it('should update conventionInfo', async () => {
      const univUUID = '736bd860-3928-457e-9f40-3f367c36be30';
      const psy = psyList[0];
      psy.state = demarchesSimplifiees.DOSSIER_STATE.accepte;
      await dbPsychologists.savePsychologistInPG([psy]);
      const savedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psy.personalEmail);
      // Check that fields are not set pre-test
      expect(savedPsy.isConventionSigned).not.to.exist;
      expect(savedPsy.declaredUniversityId).to.not.equal(univUUID);

      await dbPsychologists.updateConventionInfo(
        savedPsy.dossierNumber,
        univUUID,
        true, // isConventionSigned
      );

      const updatedPsy = await dbPsychologists.getAcceptedPsychologistByEmail(psy.personalEmail);

      expect(updatedPsy.isConventionSigned).to.equal(true);
      expect(updatedPsy.declaredUniversityId).to.equal(univUUID);
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

  describe('saveAssignedUniversity', () => {
    it('should update assignedUniversityId', async () => {
      const univUUID = '736bd860-3928-457e-9f40-3f367c36be30';
      const psy = psyList[0];
      psy.state = demarchesSimplifiees.DOSSIER_STATE.accepte;
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
});
