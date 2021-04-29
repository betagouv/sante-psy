const assert = require('chai').assert;
require('dotenv').config();
const dbUniversities = require("../db/universities");
const expect = require('chai').expect;
const clean = require('./helper/clean');

describe('DB Universities', async () => {
  const psyList = clean.psyList();
  const universities = await dbUniversities.getUniversities()

  describe('getAssignedUniversityId', () => {
    it('should get a assigned university based on departement number', async () => {
      const assignedUniId = dbUniversities.getAssignedUniversityId(psyList[0], universities);

      assignedUniId.should.be.equal("TODO");
    });

    it('should get null if departement is unkown', async () => {
      const assignedUniId = dbUniversities.getAssignedUniversityId(psyList[0], universities);

      assert(assignedUniId, null)
    });

    it('should get null if uni name is unknown', async () => {
      const assignedUniId = dbUniversities.getAssignedUniversityId(psyList[0], universities);

      assert(assignedUniId, null)
    });
  });
});
