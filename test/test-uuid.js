const should = require('chai').should();
const uuid = require('../utils/uuid');

describe('uuid', () => {
  describe('generateUuidFromString', () => {
    it('should generate a uuid from a string', async () => {
      const result = uuid.generateUuidFromString("my-id");

      result.should.be.equal("5b8fca8a-bcfa-5a6d-a97a-72404d0b0216");
    });
  });
});