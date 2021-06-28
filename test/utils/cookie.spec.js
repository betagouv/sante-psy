const sinon = require('sinon');
const rewire = require('rewire');
const { expect } = require('chai');
const { v4: uuidv4 } = require('uuid');
const jwtDecode = require('jwt-decode');
const { default: CustomError } = require('../../utils/CustomError');

const cookie = rewire('../../utils/cookie');

describe('cookie', () => {
  describe('getSessionDuration', () => {
    it('should return a duration with format X hours', () => {
      const getSessionDuration = cookie.__get__('getSessionDuration');

      getSessionDuration().should.equal('2 hours');
    });
  });

  describe('getJwtTokenForUser', () => {
    it('should return a json web token with only id', () => {
      const psychologist = uuidv4();
      const token = cookie.getJwtTokenForUser(psychologist);

      token.length.should.be.equal(200);
      const decoded = jwtDecode(token);
      decoded.should.have.all.keys('psychologist', 'iat', 'exp');
    });
  });

  describe('verifyJwt', () => {
    it('should return a json web token', () => {
      const psychologist = uuidv4();
      const token = cookie.getJwtTokenForUser(psychologist);

      const result = cookie.verifyJwt({ cookies: { token } });

      result.psychologist.should.be.eql(psychologist);
    });

    it('should return false ', () => {
      // eslint-disable-next-line max-len
      const wrongToken = 'eyfJhbGsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QiLCJpYXQiOjE2MTQwOTUzMzMsImV4cCI6MTYxNDEwMjUzM30.baGPZ6YbvwrfwH7dxv8txWrOdVAhQBx3Eg6e8joGGhU';
      const result = cookie.verifyJwt({ cookies: { token: wrongToken } });

      result.should.be.equal(false);
    });

    it('should delete cookie on expired token', () => {
      // eslint-disable-next-line max-len
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwc3ljaG9sb2dpc3QiOiJmODdlMzNjZC03MGUzLTQxYmItYjE3ZS04YTc2OGFlMGM4OTIiLCJpYXQiOjE2MjQ2MjgxMDIsImV4cCI6MTYyNDYyODEwM30.ZADGJyqXdUNxSkoRB6UVwWxXUJthJujoyP2nGZx_b8k';
      const clearStub = sinon.stub();

      const verify = () => cookie.verifyJwt(
        { cookies: { token: expiredToken } },
        { clearCookie: clearStub },
      );

      expect(verify).to.throw(CustomError);
      sinon.assert.calledWith(clearStub, 'token');
    });
  });
});
