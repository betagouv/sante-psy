import chai, { expect } from 'chai';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import jwtDecode from 'jwt-decode';
import CustomError from '../../utils/CustomError';

import cookie from '../../utils/cookie';

describe('cookie', () => {
  describe('getSessionDuration', () => {
    it('should return a duration with format X hours', () => {
      cookie.getSessionDuration().should.equal('2 hours');
    });
  });

  describe('getJwtTokenForUser', () => {
    it('should return a json web token with only id', () => {
      const psychologist = uuidv4();
      const token = cookie.getJwtTokenForUser(psychologist, 'randomXSRF');

      token.length.should.be.equal(233);
      const decoded = jwtDecode(token);
      decoded.should.have.all.keys('psychologist', 'xsrfToken', 'iat', 'exp');
    });
  });

  describe('verifyJwt', () => {
    it('should return a json web token', () => {
      const psychologist = uuidv4();
      const token = cookie.getJwtTokenForUser(psychologist, 'randomXSRF');

      // @ts-expect-error => fake cookie
      const result = cookie.verifyJwt({ cookies: { token } });

      result.psychologist.should.be.eql(psychologist);
    });

    it('should return false with wrong token', () => {
      // eslint-disable-next-line max-len
      const wrongToken = 'eyfJhbGsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3QiLCJpYXQiOjE2MTQwOTUzMzMsImV4cCI6MTYxNDEwMjUzM30.baGPZ6YbvwrfwH7dxv8txWrOdVAhQBx3Eg6e8joGGhU';
      // @ts-expect-error => fake cookie
      const result = cookie.verifyJwt({ cookies: { token: wrongToken } });

      chai.assert.isUndefined(result);
    });

    it('should delete cookie on expired token', () => {
      // eslint-disable-next-line max-len
      const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwc3ljaG9sb2dpc3QiOiJhYjZhYTk0My0wZmU5LTQyYTAtOWRkZC05ZTE2ZjdlOTk5M2UiLCJ4c3JmVG9rZW4iOiJyYW5kb21YU1JGVG9rZW4iLCJpYXQiOjE2MjQ4NzY3ODMsImV4cCI6MTYyNDg3Njg0M30.f8Yp-wJ3PXej6vzvMZD_rT2Xi3flYtXoe5s_wFkjFl0';
      const clearStub = sinon.stub();

      const verify = () => cookie.verifyJwt(
      // @ts-expect-error => fake cookie
        { cookies: { token: expiredToken } },
        { clearCookie: clearStub },
      );

      expect(verify).to.throw(CustomError);
      sinon.assert.calledWith(clearStub, 'token');
    });
  });
});
