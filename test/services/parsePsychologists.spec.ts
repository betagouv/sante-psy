import { dossier } from '../dossier';
import uuid from '../../utils/uuid';
import { DossierState } from '../../types/DossierState';
import parsePsychologists from '../../services/demarchesSimplifiees/parsePsychologists';

import dotEnv from 'dotenv';

dotEnv.config();

describe('parsePsychologists', () => {
  it('should return an array of psychologists from a JSON', async () => {
    const apiResponse = dossier;

    // @ts-expect-error => test
    const output = parsePsychologists(apiResponse);
    // eslint-disable-next-line max-len
    const description = "Le Lorem Ipsum est simplement du faux texte employé dans la composition et la mise en page avant impression. Le Lorem Ipsum est le faux texte standard de l'imprimerie depuis les années 1500, quand un imprimeur anonyme assembla ensemble des morceaux de texte pour réaliser un livre spécimen de polices de texte. Il n'a pas fait que survivre cinq siècles, mais s'est aussi adapté à la bureautique informatique, sans que son contenu n'en soit modifié. Il a été popularisé dans les années 1960 grâce à la vente de feuilles Letraset contenant des passages du Lorem Ipsum, et, plus récemment, par son inclusion dans des applications de mise en page de texte, comme Aldus PageMaker.";
    const result = [
      {
        dossierNumber: uuid.getUuidDossierNumber(1),
        civilite: 'M',
        lastName: 'Last',
        firstNames: 'First',
        archived: false,
        state: DossierState.accepte,
        adeli: '829302942',
        acceptationDate: new Date('2020-01-02'),
        address: 'SSR CL AL SOLA 66110 MONTBOLO',
        departement: '14 - Calvados',
        region: 'Normandie',
        diploma: 'Psychologie clinique de la santé',
        diplomaYear: '05 février 2002',
        phone: '0468396600',
        email: 'psychologue.test@beta.gouv.fr',
        personalEmail: 'loginemail@beta.gouv.fr',
        website: 'beta.gouv.fr',
        teleconsultation: true,
        description,
        // eslint-disable-next-line max-len
        training: '["Connaissance et pratique des outils diagnostic psychologique","Connaissance des troubles psychopathologiques du jeune adulte : dépressions","risques suicidaires","addictions","comportements à risque","troubles alimentaires","décompensation schizophrénique","psychoses émergeantes ainsi qu’une pratique de leur repérage","Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)"]',
        languages: 'Français ,Anglais, et Espagnol',
      },
      {
        dossierNumber: uuid.getUuidDossierNumber(2),
        civilite: 'M',
        lastName: '2ème',
        firstNames: 'Personne',
        archived: false,
        state: DossierState.accepte,
        adeli: '829302942',
        address: 'SSR CL AL SOLA 66110 MONTBOLO',
        departement: '14 - Calvados',
        region: 'Normandie',
        phone: '0468396600',
        diploma: 'Psychologie clinique de la santé',
        diplomaYear: '05 février 2002',
        email: 'psychologue.test@beta.gouv.fr',
        personalEmail: 'loginEmail2@beta.gouv.fr',
        website: 'beta.gouv.fr',
        teleconsultation: false,
        description,
        // eslint-disable-next-line max-len
        training: '["Connaissance et pratique des outils diagnostic psychologique","Connaissance des troubles psychopathologiques du jeune adulte : dépressions","risques suicidaires","addictions","comportements à risque","troubles alimentaires","décompensation schizophrénique","psychoses émergeantes ainsi qu’une pratique de leur repérage","Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)"]',
        languages: 'Français ,Anglais, et Espagnol',
      },
    ];

    output.should.eql(result);
  });
});
