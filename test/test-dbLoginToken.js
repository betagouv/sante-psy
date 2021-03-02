require('dotenv').config();
const assert = require('chai').assert;
const expect = require('chai').expect;
const dbToginToken = require('../db/loginToken')
const date = require('../utils/date')
const clean = require('./helper/clean');

describe('DB Login token', () => {
  // eslint-disable-next-line max-len
  const token = "0Hj1xrlN6p4icK7TwC7YCr6vMLR0NXenAjBz7fMokWa10t1sYQVRSXmZ8QV6uKXnc5sdLtJRmZ7FqtKpBvd3vaZd2if7W7eVkVwu92kc1dciSfndzpx2Gvx/ipo5Nt5YRoD4/mUaJdi8kr3ZBSHc4y3+k4EXXSVuTPzR0/NM2s7xuO743Cf/OCcPL/jlh0Eqc55VRtmD5Yh59labiT/mpUcxa273wzD+iS7AUSDQ2xjIIBmLuTPhG7+HDbs6NaSvI4MtmhhWeIQkuflszqnKQbYv5g9vqAjB9fP2/Owdr8AgFyc4CYS4budU1qyYmDaY1j9jVGIyVuWLSNwYRTSkXQ=="
  //Clean up all data
  beforeEach(async function before() {
    await clean.cleanDataToken();
  })

  describe('getByToken', () => {

    it('should get all token info with a token', async () => {
      const email = "ok@email.org";
      const expiresAt = date.getDatePlusOneHour();
      await dbToginToken.insert(token, email, expiresAt);
      const result = await dbToginToken.getByToken(token);

      result.token.should.be.equal(token);
      result.email.should.be.equal(email);
      date.parseDate(result.expiresAt).should.be.equal(expiresAt);
    });

    it('should get nothing if token is older than one hour', async () => {
      const email = "ok@email.org";
      const expirationDate = new Date()
      const expiredDate = new Date(expirationDate.setHours(expirationDate.getHours() - 6)).toISOString();
      await dbToginToken.insert(token, email, expiredDate);
      const result = await dbToginToken.getByToken(token);

      assert(result === undefined);
    });
  });

  describe('insert', () => {
    it('should insert a token and get it with its email', async () => {
      const email = "ok@email.org";
      const expiresAt = date.getDatePlusOneHour();
      await dbToginToken.insert(token, email, expiresAt);

      const result = await dbToginToken.getByToken(token);
      result.token.should.be.equal(token);
      result.email.should.be.equal(email);
      date.parseDate(result.expiresAt).should.be.equal(expiresAt);
    });
  });

  describe('delete', () => {
    it('should delete an existing token', async () => {
      const email = "ok@email.org";
      // eslint-disable-next-line max-len
      const token = "0Hj1xrlN6p4icK7TwC7YCr6vMLR0NXenAjBz7fMokWa10t1sYQVRSXmZ8QV6uKXnc5sdLtJRmZ7FqtKpBvd3vaZd2if7W7eVkVwu92kc1dciSfndzpx2Gvx/ipo5Nt5YRoD4/mUaJdi8kr3ZBSHc4y3+k4EXXSVuTPzR0/NM2s7xuO743Cf/OCcPL/jlh0Eqc55VRtmD5Yh59labiT/mpUcxa273wzD+iS7AUSDQ2xjIIBmLuTPhG7+HDbs6NaSvI4MtmhhWeIQkuflszqnKQbYv5g9vqAjB9fP2/Owdr8AgFyc4CYS4budU1qyYmDaY1j9jVGIyVuWLSNwYRTSkXQ=="
      const expiresAt = date.getDatePlusOneHour();
      await dbToginToken.insert(token, email, expiresAt);

      await dbToginToken.delete(token);
      const result = await dbToginToken.getByToken(token);
      assert(result === undefined);
    });

    it('should throw error when token does not exist', async () => {
      try {
        await dbToginToken.delete("pizza");
        assert.fail("delete token should have failed");
      } catch( error ) {
        expect(error).to.be.an('Error');
      }
    });
  });
});