const { assert } = require('chai');
require('dotenv').config();
const dbUniversities = require('../db/universities');

describe('DB Universities', () => {
  const uniId = 'bb4d80e0-c2c4-50c5-94d7-a595c34ec81e';
  const uniName = 'Occitanie Ouest';
  const universities = [{
    id: uniId,
    name: uniName,
  }];

  describe('getAssignedUniversityId', () => {
    it('should get a assigned university based on departement number', async () => {
      const psy = {
        departement: '30 - Gard',
        dossierNumber: 'dd4d80e0-c2c4-50c5-94d7-a595c34ec81e',
      };
      const assignedUniId = dbUniversities.getAssignedUniversityId(psy, universities);
      assignedUniId.should.be.equal(uniId);
    });

    it('should get the same assigned university if already assigned', async () => {
      const alreadyAssignedUniId = 'aa4d80e0-c2c4-50c5-94d7-a595c34ec81e';
      const psy = {
        departement: '30 - Gard',
        dossierNumber: 'dd4d80e0-c2c4-50c5-94d7-a595c34ec81e',
        assignedUniversityId: alreadyAssignedUniId,
      };
      const assignedUniId = dbUniversities.getAssignedUniversityId(psy, universities);
      assignedUniId.should.be.equal(alreadyAssignedUniId);
    });

    it('should get null if departement is unkwown', async () => {
      const psy = {
        departement: 'pizza',
        dossierNumber: 'dd4d80e0-c2c4-50c5-94d7-a595c34ec81e',
      };
      const assignedUniId = dbUniversities.getAssignedUniversityId(psy, universities);

      assert.equal(assignedUniId, null);
    });

    it('should get null if uni name is unknown for department', async () => {
      const psy = {
        departement: '100 - pizza', // 100 does not match any uni in our list
        dossierNumber: 'dd4d80e0-c2c4-50c5-94d7-a595c34ec81e',
      };
      const assignedUniId = dbUniversities.getAssignedUniversityId(psy, universities);

      assert.equal(assignedUniId, null);
    });
  });

  describe('getUniversityId', () => {
    it('should get uni id for a name', async () => {
      const output = dbUniversities.getUniversityId(universities, uniName);
      output.should.be.equal(uniId);
    });

    it('should get undefined when unknown name', async () => {
      const output = dbUniversities.getUniversityId(universities, 'pizza university');
      assert.equal(output, undefined);
    });
  });

  describe('getUniversityName', () => {
    it('should get uni id for a name', async () => {
      const output = dbUniversities.getUniversityName(universities, uniId);
      output.should.be.equal(uniName);
    });

    it('should get undefined when unknown id', async () => {
      const output = dbUniversities.getUniversityName(universities, 'pizzaId');
      assert.equal(output, undefined);
    });
  });

  describe('getEmailsTo', () => {
    const emailUniversity1 = 'emailUniversity1@beta.gouv.fr';
    const emailUniversity2 = 'emailUniversity2@beta.gouv.fr';
    const emailUniversityAll = `${emailUniversity1} ; ${emailUniversity2}`;
    const emailSSU = 'emailSSU@beta.gouv.fr';

    it('should get a commma list of email if multiple emails', () => {
      const university = {
        id: uniId,
        name: uniName,
        emailUniversity: emailUniversityAll,
        emailSSU,
      };

      const output = dbUniversities.getEmailsTo(university);
      output.should.be.equal(`${emailUniversity1},${emailUniversity2}`);
    });

    it('should get string if only one email', () => {
      const university = {
        id: uniId,
        name: uniName,
        emailUniversity: emailUniversity1,
        emailSSU,
      };

      const output = dbUniversities.getEmailsTo(university);
      output.should.be.equal(`${university.emailUniversity}`);
    });

    it('should get undefined when unknown id', () => {
      const university = {
        id: uniId,
        name: uniName,
        emailUniversity: null,
        emailSSU,
      };

      const output = dbUniversities.getEmailsTo(university);
      assert.equal(output, emailSSU);
    });
  });
});
