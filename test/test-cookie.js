const cookie = require('../utils/cookie');

describe('cookie', () => {
  describe('getJwtTokenForUser', () => {
    it('should return a json web token', () => {
      const result = cookie.getJwtTokenForUser('test');
      console.log("result", result);
      result.length.should.be.equal(148);
    });
  });

  describe('verifyJwt', () => {
    it('should return a json web token', () => {
      const email = 'myEmail'
      const token = cookie.getJwtTokenForUser(email);
      const result = cookie.verifyJwt(token);

      result.should.be.equal(email);
    });

    it('should return false ', () => {
      // eslint-disable-next-line max-len
      const wrongToken = 'eyfJhbGsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QiLCJpYXQiOjE2MTQwOTUzMzMsImV4cCI6MTYxNDEwMjUzM30.baGPZ6YbvwrfwH7dxv8txWrOdVAhQBx3Eg6e8joGGhU'
      const result = cookie.verifyJwt(wrongToken);

      result.should.be.equal(false);
    });
  });
});