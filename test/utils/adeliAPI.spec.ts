import { expect } from 'chai';
import { preprocessIds, cleanId } from '../../utils/adeliAPI';

describe('adeliAPI', () => {
  describe('preprocessIds', () => {
    it('should return preprocessIds', async () => {
      const ids = [
        '07 93 0032 3',
        'numéro ADELI : 92 001445 3',
        '123',
        '123456789',
        'abcdefgh',
        '  1__235486',
        ' 1 23 5abc '];
      const validIds = preprocessIds(ids);
      expect(validIds).to.eql(['0079300323', '0123456789']);
    });
  });

  describe('clean Id', () => {
    it('should return clean id', () => {
      expect(cleanId('07 93 0032 3')).to.eql('079300323');
    });
  });
});
