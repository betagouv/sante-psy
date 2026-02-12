import { assert, expect } from 'chai';
import dbLoginToken from '../../db/loginToken';
import date from '../../utils/date';
import clean from '../helper/clean';

import dotEnv from 'dotenv';

dotEnv.config();

describe('DB Login token', () => {
  const token = '0Hj1xrlN6p4icK7TwC7YCr6vMLR0NXen';
  // Clean up all data
  beforeEach(async () => {
    await clean.dataToken();
  });

  describe('getByToken', () => {
    it('should get all token info with a token', async () => {
      const email = 'prenom.nom@beta.gouv.fr';
      const expiresAt = date.getDatePlusOneHour();
      await dbLoginToken.upsert(token, email, expiresAt);
      const result = await dbLoginToken.getByToken(token);

      result.token.should.be.equal(token);
      result.email.should.be.equal(email);
      new Date(result.expiresAt).getTime().should.be.equal(expiresAt.getTime());
    });

    it('should get nothing if token is older than one hour', async () => {
      const email = 'prenom.nom@beta.gouv.fr';
      const expirationDate = new Date();
      const expiredDate = new Date(expirationDate.setHours(expirationDate.getHours() - 6));
      await dbLoginToken.upsert(token, email, expiredDate);
      const result = await dbLoginToken.getByToken(token);

      assert.isUndefined(result);
    });
  });

  describe('upsert', () => {
    it('should upsert a token and get it with its email', async () => {
      const email = 'prenom.nom@beta.gouv.fr';
      const expiresAt = date.getDatePlusOneHour();
      await dbLoginToken.upsert(token, email, expiresAt);

      const result = await dbLoginToken.getByToken(token);
      result.token.should.be.equal(token);
      result.email.should.be.equal(email);
      new Date(result.expiresAt).getTime().should.be.equal(expiresAt.getTime());
    });
  });

  describe('delete', () => {
    it('should delete an existing token', async () => {
      const email = 'prenom.nom@beta.gouv.fr';
      const expiresAt = date.getDatePlusOneHour();
      await dbLoginToken.upsert(token, email, expiresAt);

      await dbLoginToken.delete(token);
      const result = await dbLoginToken.getByToken(token);
      assert.isUndefined(result);
    });

    it('should throw error when token does not exist', async () => {
      try {
        await dbLoginToken.delete('pizza');
        assert.fail('delete token should have failed');
      } catch (error) {
        expect(error).to.be.an('Error');
      }
    });
  });
});
