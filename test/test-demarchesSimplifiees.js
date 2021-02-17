require('dotenv').config();
const rewire = require('rewire');
const should = require('chai').should();
const assert = require('chai').assert;
const nock = require('nock');
const testDossiers = require('./dossier.json');

const demarchesSimplifiees = rewire('../utils/demarchesSimplifiees.js');

describe('Demarches Simplifiess', () => {
  describe('parsePsychologist', () => {
    it('should return an array of psychologists from a JSON', async () => {
      const apiResponse = testDossiers

      const parsePsychologist = demarchesSimplifiees.__get__('parsePsychologist');
      const output = parsePsychologist(apiResponse)
      // eslint-disable-next-line max-len
      const description = "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker."
      const result = [
        {
          name:'Last First',
          address: 'SSR CL AL SOLA 66110 MONTBOLO',
          phone: '0468396600',
          email: 'psychologue.test@apas82.mssante.fr',
          website: 'apas82.mssante.fr',
          teleconsultation: true,
          description: description
        },
        {
          name: '2ème Personne',
          address: 'SSR CL AL SOLA 66110 MONTBOLO',
          phone: '0468396600',
          email: 'psychologue.test@apas82.mssante.fr',
          website: 'apas82.mssante.fr',
          teleconsultation: false,
          description: description
        }
      ];

      output.should.eql(result);
    });
  });

  describe('getName', () => {
    it('should return Last Name First Name', async () => {
      const apiResponse = { civilite: 'M', nom: 'last', prenom: 'fiRst' };

      const getName = demarchesSimplifiees.__get__('getName');
      const output = getName(apiResponse);

      output.should.equal('Last First');
    });

  });


  describe('getNextCursor', () => {
    it('should return cursor string if there is more page to load', async () => {
      const cursor = "MQ";
      const apiResponse = {
        "demarche": {
          "dossiers": {
            "pageInfo": {
              "hasNextPage": true,
              "endCursor": cursor
            }
          }
        }
      }

      const getNextCursor = demarchesSimplifiees.__get__('getNextCursor');
      const output = getNextCursor(apiResponse);

      output.should.equal(cursor);
    });

    it('should return undefined if there is no page to load', async () => {
      const cursor = "MQ";
      const apiResponse = {
        "demarche": {
          "dossiers": {
            "pageInfo": {
              "hasNextPage": false,
              "endCursor": cursor
            }
          }
        }
      }

      const getNextCursor = demarchesSimplifiees.__get__('getNextCursor');

      assert(getNextCursor(apiResponse) === undefined);
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

    it('should return empty string for a field Champ that does not exist', async () => {
      const result = '';
      const label = 'Intitulé ou spécialité de votre master de psychologie';

      const apiResponse = [
        {
          'id': 'Q2hhbXAtMTYzMDQxNg==',
          'label': 'Votre carrière et vos qualifications',
          'stringValue': ''
        },
        {
          'id': 'Q2hhbXAtMTYzMDQxNw==',
          'label': 'nothing',
          'stringValue': result
        }
      ];

      const getChampValue = demarchesSimplifiees.__get__('getChampValue');
      const output = getChampValue(apiResponse, label);

      output.should.equal(result);
    });
  });
});