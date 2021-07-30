import testDossiers from './dossier.json';
import uuid from '../../utils/uuid';
import config from '../../utils/config';
import { DossierState } from '../../types/DemarcheSimplifiee';
import importDossier from '../../services/demarchesSimplifiees/importDossier';

require('dotenv').config();

describe('Demarches Simplifiees', () => {
  describe('parsePsychologists', () => {
    it('should return an array of psychologists from a JSON', async () => {
      const apiResponse = testDossiers;

      const getUuidDossierNumber = importDossier.__get__('getUuidDossierNumber');

      const parsePsychologists = importDossier.__get__('parsePsychologists');
      const output = parsePsychologists(apiResponse);
      // eslint-disable-next-line max-len
      const description = "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.";
      const result = [
        {
          dossierNumber: getUuidDossierNumber(1),
          lastName: 'Last',
          firstNames: 'First',
          archived: false,
          state: DossierState.accepte,
          adeli: '829302942',
          address: 'SSR CL AL SOLA 66110 MONTBOLO',
          diploma: 'Psychologie clinique de la santé',
          phone: '0468396600',
          email: 'psychologue.test@beta.gouv.fr',
          personalEmail: 'loginemail@beta.gouv.fr',
          website: 'beta.gouv.fr',
          teleconsultation: true,
          description,
          // eslint-disable-next-line max-len
          training: '["Connaissance et pratique des outils diagnostic psychologique","Connaissance des troubles psychopathologiques du jeune adulte : dépressions","risques suicidaires","addictions","comportements à risque","troubles alimentaires","décompensation schizophrénique","psychoses émergeantes ainsi qu’une pratique de leur repérage","Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)"]',
          departement: '14 - Calvados',
          region: 'Normandie',
          languages: 'Français ,Anglais, et Espagnol',
        },
        {
          dossierNumber: getUuidDossierNumber(2),
          lastName: '2ème',
          firstNames: 'Personne',
          archived: false,
          state: DossierState.accepte,
          adeli: '829302942',
          address: 'SSR CL AL SOLA 66110 MONTBOLO',
          phone: '0468396600',
          diploma: 'Psychologie clinique de la santé',
          email: 'psychologue.test@beta.gouv.fr',
          personalEmail: 'loginEmail2@beta.gouv.fr',
          website: 'beta.gouv.fr',
          teleconsultation: false,
          description,
          // eslint-disable-next-line max-len
          training: '["Connaissance et pratique des outils diagnostic psychologique","Connaissance des troubles psychopathologiques du jeune adulte : dépressions","risques suicidaires","addictions","comportements à risque","troubles alimentaires","décompensation schizophrénique","psychoses émergeantes ainsi qu’une pratique de leur repérage","Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)"]',
          departement: '14 - Calvados',
          region: 'Normandie',
          languages: 'Français ,Anglais, et Espagnol',
        },
      ];

      output.should.eql(result);
    });
  });

  describe('getUuidDossierNumber', () => {
    it('should return a uuid based on the given id', async () => {
      const dossierNumber = 1;

      const getUuidDossierNumber = importDossier.__get__('getUuidDossierNumber');
      const output = getUuidDossierNumber(dossierNumber);
      const result = uuid.generateFromString(`${config.demarchesSimplifieesId}-${dossierNumber}`);

      output.should.equal(result);
    });
  });

  describe('parseTraining', () => {
    it('should return an array of a string if only one element', async () => {
      const apiResponse = 'training1';

      const parseTraining = importDossier.__get__('parseTraining');
      const output = parseTraining(apiResponse);

      output.should.equal(JSON.stringify([apiResponse]));
    });

    it('should return an array of several strings if multiples specialities/Trainings', async () => {
      const apiResponse = 'training1, training2';

      const parseTraining = importDossier.__get__('parseTraining');
      const output = parseTraining(apiResponse);

      output.should.equal(JSON.stringify(['training1', 'training2']));
    });
  });
});
