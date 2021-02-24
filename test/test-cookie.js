const cookie = require('../utils/cookie');

describe('cookie', () => {
  describe('getJwtTokenForUser', () => {
    it('should return a json web token', () => {
      const email = 'myEmail'
      const psychologistData = {'email': 'stuff'}
      const token = cookie.getJwtTokenForUser(email, psychologistData);

      token.length.should.be.equal(201);
    });
  });

  describe('verifyJwt', () => {
    it('should return a json web token', () => {
      const email = 'myEmail'
      const psychologistData = {'email': 'stuff'}
      const token = cookie.getJwtTokenForUser(email, psychologistData);
      const result = cookie.verifyJwt(token);

      result.email.should.be.equal(email);
      result.psychologistData.should.be.eql(psychologistData);
    });

    it('should return false ', () => {
      // eslint-disable-next-line max-len
      const wrongToken = 'eyfJhbGsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QiLCJpYXQiOjE2MTQwOTUzMzMsImV4cCI6MTYxNDEwMjUzM30.baGPZ6YbvwrfwH7dxv8txWrOdVAhQBx3Eg6e8joGGhU'
      const result = cookie.verifyJwt(wrongToken);

      result.should.be.equal(false);
    });
  });
});