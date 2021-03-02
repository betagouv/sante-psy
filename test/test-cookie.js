const rewire = require('rewire');
const cookie = rewire('../utils/cookie');

describe('cookie', () => {
  describe('getSessionDuration', () => {
    it('should return a duration with format X hours', () => {
      const getSessionDuration = cookie.__get__('getSessionDuration');

      getSessionDuration().should.equal('2 hours');
    });
  });

  describe('getJwtTokenForUser', () => {
    it('should return a json web token', () => {
      const email = 'myEmail'
      const psychologist = {'email': 'stuff'}
      const token = cookie.getJwtTokenForUser(email, psychologist);

      token.length.should.be.equal(196);
    });
  });

  describe('verifyJwt', () => {
    it('should return a json web token', () => {
      const email = 'myEmail'
      const psychologist = {'email': 'stuff'}
      const token = cookie.getJwtTokenForUser(email, psychologist);
      const result = cookie.verifyJwt(token);

      result.email.should.be.equal(email);
      result.psychologist.should.be.eql(psychologist);
    });

    it('should return false ', () => {
      // eslint-disable-next-line max-len
      const wrongToken = 'eyfJhbGsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QiLCJpYXQiOjE2MTQwOTUzMzMsImV4cCI6MTYxNDEwMjUzM30.baGPZ6YbvwrfwH7dxv8txWrOdVAhQBx3Eg6e8joGGhU'
      const result = cookie.verifyJwt(wrongToken);

      result.should.be.equal(false);
    });
  });
});