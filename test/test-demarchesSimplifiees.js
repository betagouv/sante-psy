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

      const result = [
        { 
          name:'First Last',
          address: 'SSR CL AL SOLA 66110 MONTBOLO',
          phone: '0468396600' 
        },
        { name: 'Personne 2ème',
          address: 'SSR CL AL SOLA 66110 MONTBOLO',
          phone: '0468396600' 
        }
      ];

      output.should.eql(result);
    });
  });
  
  describe('getName', () => {
    it('should return First Name Last Name', async () => {
      const apiResponse = { civilite: 'M', nom: 'Last', prenom: 'First' };

      const getName = demarchesSimplifiees.__get__('getName');
      const output = getName(apiResponse);

      output.should.equal('First Last');
    });
  }); 
  
  describe('getChampValue', () => {
    it('should return stringValue for field Champ', async () => {
      const result = 'Psychologie clinique de la santé';
      const label = 'Intitulé ou spécialité de votre master de psychologie';

      const apiResponse = [
        {
          'id': 'Q2hhbXAtMTYzMDQxNg==',
          'label': 'Votre carrière et vos qualifications',
          'stringValue': ''
        },
        {
          'id': 'Q2hhbXAtMTYzMDQxNw==',
          'label': label,
          'stringValue': result
        }
      ];

      const getChampValue = demarchesSimplifiees.__get__('getChampValue');
      const output = getChampValue(apiResponse, label);

      output.should.equal(result);
    });
  });
});