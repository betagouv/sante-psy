import uuid from '../utils/uuid';
import config from '../utils/config';

describe('uuid', () => {
  describe('generateFromString', () => {
    it('should generate a uuid from a string', async () => {
      const result = uuid.generateFromString('my-id');

      result.should.be.equal('5b8fca8a-bcfa-5a6d-a97a-72404d0b0216');
    });
  });

  describe('getUuidDossierNumber', () => {
    it('should return a uuid based on the given id', async () => {
      const dossierNumber = 1;

      const output = uuid.getUuidDossierNumber(dossierNumber);
      const result = uuid.generateFromString(`${config.demarchesSimplifieesId}-${dossierNumber}`);

      output.should.equal(result);
    });
  });
});
