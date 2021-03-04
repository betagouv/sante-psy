require('dotenv').config();
const rewire = require('rewire');
const assert = require('chai').assert;
const testDossiers = require('./dossier.json');
const uuid = require('../utils/uuid');
const config = require('../utils/config');

const demarchesSimplifiees = rewire('../utils/demarchesSimplifiees.js');

describe('Demarches Simplifiess', () => {
  describe('parsePsychologist', () => {
    it('should return an array of psychologists from a JSON', async () => {
      const apiResponse = testDossiers

      const getUuidDossierNumber = demarchesSimplifiees.__get__('getUuidDossierNumber');

      const parsePsychologist = demarchesSimplifiees.__get__('parsePsychologist');
      const output = parsePsychologist(apiResponse)
      // eslint-disable-next-line max-len
      const description = "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker."
      const result = [
        {
          dossierNumber: getUuidDossierNumber(1),
          lastName: 'Last',
          firstNames: 'First',
          archived : false,
          state : 'accepte',
          adeli: "829302942",
          address: 'SSR CL AL SOLA 66110 MONTBOLO',
          diploma: "Psychologie clinique de la santé",
          phone: '0468396600',
          email: 'psychologue.test@beta.gouv.fr',
          emailLogin: 'loginEmail@beta.gouv.fr',
          website: 'apas82.mssante.fr',
          teleconsultation: true,
          description: description,
          // eslint-disable-next-line max-len
          training: "[\"Connaissance et pratique des outils diagnostic psychologique\",\"Connaissance des troubles psychopathologiques du jeune adulte : dépressions\",\"risques suicidaires\",\"addictions\",\"comportements à risque\",\"troubles alimentaires\",\"décompensation schizophrénique\",\"psychoses émergeantes ainsi qu’une pratique de leur repérage\",\"Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)\"]",
          departement: "14 - Calvados",
          region: "Normandie",
          languages: "Français ,Anglais, et Espagnol",
        },
        {
          dossierNumber: getUuidDossierNumber(2),
          lastName: '2ème',
          firstNames: 'Personne',
          archived : false,
          state : 'accepte',
          adeli: "829302942",
          address: 'SSR CL AL SOLA 66110 MONTBOLO',
          phone: '0468396600',
          diploma: "Psychologie clinique de la santé",
          email: 'psychologue.test@beta.gouv.fr',
          emailLogin: 'loginEmail2@beta.gouv.fr',
          website: 'apas82.mssante.fr',
          teleconsultation: false,
          description: description,
          // eslint-disable-next-line max-len
          training: "[\"Connaissance et pratique des outils diagnostic psychologique\",\"Connaissance des troubles psychopathologiques du jeune adulte : dépressions\",\"risques suicidaires\",\"addictions\",\"comportements à risque\",\"troubles alimentaires\",\"décompensation schizophrénique\",\"psychoses émergeantes ainsi qu’une pratique de leur repérage\",\"Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)\"]",
          departement: "14 - Calvados",
          region: "Normandie",
          languages: "Français ,Anglais, et Espagnol",
        }
      ];

      output.should.eql(result);
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

  describe('getUuidDossierNumber', () => {
    it('should return a uuid based on the given id', async () => {
      const dossierNumber = 1;

      const getUuidDossierNumber = demarchesSimplifiees.__get__('getUuidDossierNumber');
      const output = getUuidDossierNumber(dossierNumber);
      const result = uuid.generateUuidFromString(config.demarchesSimplifieesId + '-' + dossierNumber);

      output.should.equal(result);
    });
  });

  describe('parseTraining', () => {
    it('should return an array of a string if only one element', async () => {
      const apiResponse = "training1";

      const parseTraining = demarchesSimplifiees.__get__('parseTraining');
      const output = parseTraining(apiResponse);

      output.should.equal(JSON.stringify([apiResponse]));
    });

    it('should return an array of several strings if multiples specialities/Trainings', async () => {
      const apiResponse = "training1, training2"

      const parseTraining = demarchesSimplifiees.__get__('parseTraining');
      const output = parseTraining(apiResponse);

      output.should.equal(JSON.stringify(["training1", "training2"]));
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

    it('should return "value" when stringValue is set to false', async () => {
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
          'value': result
        }
      ];

      const getChampValue = demarchesSimplifiees.__get__('getChampValue');
      const output = getChampValue(apiResponse, label, false);

      output.should.equal(result);
    });
  });
});