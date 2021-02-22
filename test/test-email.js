const email = require('../utils/email');

describe('email', () => {
  describe('isValidEmail', () => {
    it('should return true if the email is valid', async () => {
      const result = email.isValidEmail("my-id@test.com");

      result.should.be.equal(true);
    });

    it('should return false if the email is unvalid', async () => {
      const result = email.isValidEmail("my-id");

      result.should.be.equal(false);
    });

    it('should return false if the email is unvalid', async () => {
      const result = email.isValidEmail("my-id@id");

      result.should.be.equal(false);
    });
  });
});