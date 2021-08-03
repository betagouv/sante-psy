import { assert, expect } from 'chai';
import dbToginToken from '../../db/loginToken';
import date from '../../utils/date';
import clean from '../helper/clean';

import dotEnv from 'dotenv';

dotEnv.config();

describe('DB Login token', () => {
  const token = '0Hj1xrlN6p4icK7TwC7YCr6vMLR0NXen';
  // Clean up all data
  beforeEach(async () => {
    await clean.cleanDataToken();
  });

  describe('getByToken', () => {
    it('should get all token info with a token', async () => {
      const email = 'prenom.nom@beta.gouv.fr';
      const expiresAt = date.getDatePlusOneHour();
      await dbToginToken.insert(token, email, expiresAt);
      const result = await dbToginToken.getByToken(token);

      result.token.should.be.equal(token);
      result.email.should.be.equal(email);
      new Date(result.expiresAt).toISOString().should.be.equal(expiresAt);
    });

    it('should get nothing if token is older than one hour', async () => {
      const email = 'prenom.nom@beta.gouv.fr';
      const expirationDate = new Date();
      const expiredDate = new Date(expirationDate.setHours(expirationDate.getHours() - 6)).toISOString();
      await dbToginToken.insert(token, email, expiredDate);
      const result = await dbToginToken.getByToken(token);

      assert.isUndefined(result);
    });
  });

  describe('insert', () => {
    it('should insert a token and get it with its email', async () => {
      const email = 'prenom.nom@beta.gouv.fr';
      const expiresAt = date.getDatePlusOneHour();
      await dbToginToken.insert(token, email, expiresAt);

      const result = await dbToginToken.getByToken(token);
      result.token.should.be.equal(token);
      result.email.should.be.equal(email);
      new Date(result.expiresAt).toISOString().should.be.equal(expiresAt);
    });
  });

  describe('delete', () => {
    it('should delete an existing token', async () => {
      const email = 'prenom.nom@beta.gouv.fr';
      const expiresAt = date.getDatePlusOneHour();
      await dbToginToken.insert(token, email, expiresAt);

      await dbToginToken.delete(token);
      const result = await dbToginToken.getByToken(token);
      assert.isUndefined(result);
    });

    it('should throw error when token does not exist', async () => {
      try {
        await dbToginToken.delete('pizza');
        assert.fail('delete token should have failed');
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });
  });
});
