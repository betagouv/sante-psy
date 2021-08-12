import { assert, expect } from 'chai';
import dotEnv from 'dotenv';
import dbUniversities from '../../db/universities';
import clean from '../helper/clean';
import seed from '../helper/fake_data';
import db from '../../db/db';

dotEnv.config();

describe('DB Universities', () => {
  const uniId = 'bb4d80e0-c2c4-50c5-94d7-a595c34ec81e';
  const uniName = 'Occitanie Ouest';
  const universities = [{
    id: uniId,
    name: uniName,
    emailSSU: '',
    emailUniversity: '',
  }];

  describe('getAllOrderByName', () => {
    it('should get all universities and order them', async () => {
      await seed(db, true);

      const universities = await dbUniversities.getAllOrderByName();
      universities.length.should.equal(55);
      universities
        .map((university) => university.name)
        .sort()
        .forEach((university, i) => university.should.equal(universities[i].name));
    });
  });

  describe('getAssignedUniversityId', () => {
    it('should get a assigned university based on departement number', async () => {
      const psy = {
        ...clean.getOnePsy(),
        departement: '30 - Gard',
        dossierNumber: 'dd4d80e0-c2c4-50c5-94d7-a595c34ec81e',
      };
      const assignedUniId = dbUniversities.getAssignedUniversityId(psy, universities);
      assignedUniId.should.be.equal(uniId);
    });

    it('should get the same assigned university if already assigned', async () => {
      const alreadyAssignedUniId = 'alreadyAssignedUniId';
      const psy = {
        ...clean.getOnePsy(),
        departement: '30 - Gard',
        dossierNumber: 'dd4d80e0-c2c4-50c5-94d7-a595c34ec81e',
        assignedUniversityId: alreadyAssignedUniId,
      };
      const assignedUniId = dbUniversities.getAssignedUniversityId(psy, universities);
      assignedUniId.should.be.equal(alreadyAssignedUniId);
    });

    it('should get null if departement is unkwown', async () => {
      const psy = {
        ...clean.getOnePsy(),
        departement: 'pizza',
        dossierNumber: 'dd4d80e0-c2c4-50c5-94d7-a595c34ec81e',
      };
      const assignedUniId = dbUniversities.getAssignedUniversityId(psy, universities);

      assert.equal(assignedUniId, null);
    });

    it('should get null if uni name is unknown for department', async () => {
      const psy = {
        ...clean.getOnePsy(),
        departement: '100 - pizza', // 100 does not match any uni in our list
        dossierNumber: 'dd4d80e0-c2c4-50c5-94d7-a595c34ec81e',
      };
      const assignedUniId = dbUniversities.getAssignedUniversityId(psy, universities);

      assert.equal(assignedUniId, null);
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

    it('should manage empty info', () => {
      const university = {};

      // @ts-expect-error => test
      const output = dbUniversities.getEmailsTo(university);
      assert.isUndefined(output);
    });
  });

  describe('getNoUniversityNow', () => {
    it('should return proper university', async () => {
      await seed(db, true);
      const noUniversityNow = await dbUniversities.getNoUniversityNow();

      expect(noUniversityNow.id).to.not.be.undefined;
      noUniversityNow.name.should.be.equal('--- Aucune pour le moment');
    });
  });
});
