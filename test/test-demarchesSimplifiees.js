require('dotenv').config();

const should = require('chai').should();
const nock = require('nock');
const { getPsychologistList } = require('../utils/demarchesSimplifiees');
const testUsers = require('./psychologist.json');

describe('Demarches Simplifiess', () => {
  describe('getPsychologistList', () => {
    //@TODO testUsers should match API's schema
    it('should return an array of psychologists', async () => {
      const apiCall = nock(/.*demarches-simplifiees.fr/)
            .post(/^.*api\/v2\/graphql/)
            .reply(200, testUsers);
            
      const output = await getPsychologistList();
      apiCall.isDone().should.be.true;
    });
  });
});