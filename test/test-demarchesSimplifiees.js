require('dotenv').config();
const rewire = require('rewire');
const should = require('chai').should();
const nock = require('nock');
const testUsers = require('./psychologist.json');

const demarchesSimplifiees = rewire('../utils/demarchesSimplifiees.js');

describe('Demarches Simplifiess', () => {
  describe('getPsychologistList', () => {
    //@TODO testUsers should match API's schema
    it('should return an array of psychologists', async () => {
      const apiCall = nock(/.*demarches-simplifiees.fr/)
            .post(/^.*api\/v2\/graphql/)
            .reply(200, testUsers);
            
      const output = await demarchesSimplifiees.getPsychologistList();
      apiCall.isDone().should.be.true;
    });
  });
  describe('parsePsychologist', () => {
    //@TODO testUsers should match API's schema
    it('should return an array of psychologists from a JSON', async () => {
      const apiResponse = { demarche: { id: 'UHJvY2VkdXJlLTM5NzQ3', dossiers: {
        nodes:  [ { champs:
          [ { id: 'Q2hhbXAtMTYwMTE4Ng==',
            label: 'Nouveau champ Texte',
            stringValue: 'Nouveau champ Texte 2ème Dossier' },
          { id: 'Q2hhbXAtMTYwMzgwNQ==',
            label: 'Nouveau champ Texte',
            stringValue: 'Autre champ Texte 2ème Dossier' },
          { id: 'Q2hhbXAtMTYxODcwMw==',
            label: 'Nouveau champ Texte',
            stringValue: '' },
          { id: 'Q2hhbXAtMTYxODcwNg==',
            label: 'Nouveau champ Texte',
            stringValue: '' } ]
        } ]
      } 
      } 
      }

      const parsePsychologist = demarchesSimplifiees.__get__('parsePsychologist');
      const output = parsePsychologist(apiResponse)

      const result = [{ 
        name:'in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
        address:'in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ',
        phone:'in voluptate velit esse cillum dolore eu fugiat nulla pariatur. '
      },
      { name: 'Nouveau champ Texte 2ème Dossier',
        address: 'Nouveau champ Texte 2ème Dossier',
        phone: 'Nouveau champ Texte 2ème Dossier' 
      }
      ]

      output.should.equal(result);
    });
  });
});