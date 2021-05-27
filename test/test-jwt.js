const rewire = require('rewire');
const { v4: uuidv4 } = require('uuid');
const jwtDecode = require('jwt-decode');

const jwt = rewire('../utils/jwt');

describe('jwt', () => {
  describe('getSessionDuration', () => {
    it('should return a duration with format X hours', () => {
      const getSessionDuration = jwt.__get__('getSessionDuration');

      getSessionDuration().should.equal('2 hours');
    });
  });

  describe('getJwtTokenForUser', () => {
    it('should return a json web token with only id', () => {
      const psychologist = uuidv4();
      const token = jwt.getJwtTokenForUser(psychologist);

      token.length.should.be.equal(200);
      const decoded = jwtDecode(token);
      decoded.should.have.all.keys('psychologist', 'iat', 'exp');
    });
  });

  describe('verifyJwt', () => {
    it('should return a json web token', () => {
      const psychologist = uuidv4();
      const token = jwt.getJwtTokenForUser(psychologist);
      const result = jwt.verifyJwt(token);

      result.psychologist.should.be.eql(psychologist);
    });

    it('should return false ', () => {
      // eslint-disable-next-line max-len
      const wrongToken = 'eyfJhbGsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QiLCJpYXQiOjE2MTQwOTUzMzMsImV4cCI6MTYxNDEwMjUzM30.baGPZ6YbvwrfwH7dxv8txWrOdVAhQBx3Eg6e8joGGhU';
      const result = jwt.verifyJwt(wrongToken);

      result.should.be.equal(false);
    });
  });
});
