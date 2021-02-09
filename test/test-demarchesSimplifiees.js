require('dotenv').config();
const rewire = require('rewire');
const should = require('chai').should();
const nock = require('nock');
const testDossiers = require('./dossier.json');

const demarchesSimplifiees = rewire('../utils/demarchesSimplifiees.js');

describe('Demarches Simplifiess', () => {
  describe('parsePsychologist', () => {
    it('should return an array of psychologists from a JSON', async () => {
      const apiResponse = testDossiers

      const parsePsychologist = demarchesSimplifiees.__get__('parsePsychologist');
      const output = parsePsychologist(apiResponse)

      const result = [{ 
        name:'Nouveau champ Texte 1er Dossier',
        address:'Nouveau champ Texte 1er Dossier',
        phone:'Nouveau champ Texte 1er Dossier'
      },
      { name: 'Nouveau champ Texte 2ème Dossier',
        address: 'Nouveau champ Texte 2ème Dossier',
        phone: 'Nouveau champ Texte 2ème Dossier' 
      }
      ]

      output.should.eql(result);
    });
  });
});