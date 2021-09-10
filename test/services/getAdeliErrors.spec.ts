import clean from '../helper/clean';
import getAdeliErrors from '../../services/getAdeliErrors';

describe('getAdeliErrors', () => {
  const adeliInfo = {
    123: {
      'Identifiant PP': '123',
      "Nom d'exercice": 'Doe',
      "Prénom d'exercice": 'Jane',
      'Code profession': 93,
      'Libellé profession': 'Psychologue',
    },
    456: {
      'Identifiant PP': '456',
      "Nom d'exercice": 'Doe',
      "Prénom d'exercice": 'John',
      'Code profession': 77,
      'Libellé profession': 'Magicien',
    },
    1: {
      'Identifiant PP': '123',
      "Nom d'exercice": 'De La Batte',
      "Prénom d'exercice": 'Hubert',
      'Code profession': 93,
      'Libellé profession': 'Psychologue',
    },
    2: {
      'Identifiant PP': '123',
      "Nom d'exercice": 'De La Batte',
      "Prénom d'exercice": 'Bonisseur',
      'Code profession': 93,
      'Libellé profession': 'Psychologue',
    },
    3: {
      'Identifiant PP': '123',
      "Nom d'exercice": 'De La Batte',
      "Prénom d'exercice": 'Hubert Bonisseur',
      'Code profession': 93,
      'Libellé profession': 'Psychologue',
    },
    4: {
      'Identifiant PP': '123',
      "Nom d'exercice": 'Batte',
      "Prénom d'exercice": 'Hubert Bonisseur',
      'Code profession': 93,
      'Libellé profession': 'Psychologue',
    },
    5: {
      'Identifiant PP': '123',
      "Nom d'exercice": 'De La Batte',
      "Prénom d'exercice": 'Humberto',
      'Code profession': 93,
      'Libellé profession': 'Psychologue',
    },
  };

  const ADELI_ID = 'Q2hhbXAtMTYyNjk4Nw==';

  const useCases = [
    {
      psychologist: ['non existing', ADELI_ID, 'jane', 'doe'],
      errors: ['pas de correspondance pour ce numéro Adeli'],
    },
    {
      psychologist: ['456', ADELI_ID, 'john', 'doe'],
      errors: ['la personne n\'est pas un psychologue mais un Magicien'],
    },
    {
      psychologist: ['123', ADELI_ID, 'john', 'doe'],
      errors: ['les prénoms ne matchent pas (Jane vs john)'],
    },
    {
      psychologist: ['123', ADELI_ID, 'jane', 'Dane'],
      errors: ['le nom ne matche pas (Doe vs Dane)'],
    },
    {
      psychologist: ['456', ADELI_ID, 'Georges', 'Moustaki'],
      errors: [
        'la personne n\'est pas un psychologue mais un Magicien',
        'les prénoms ne matchent pas (John vs Georges)',
        'le nom ne matche pas (Doe vs Moustaki)',
      ],
    },
    {
      psychologist: ['1', ADELI_ID, 'Hubert Bonisseur', 'De la batte'],
      errors: [],
    },
    {
      psychologist: ['2', ADELI_ID, 'Hubert Bonisseur', 'De la batte'],
      errors: [],
    },
    {
      psychologist: ['3', ADELI_ID, 'Hubert Bonisseur', 'De la batte'],
      errors: [],
    },
    {
      psychologist: ['4', ADELI_ID, 'Hubert Bonisseur', 'De la batte'],
      errors: ['le nom ne matche pas (Batte vs De la batte)'],
    },
    {
      psychologist: ['3', ADELI_ID, 'Hubert Bonisseur III', 'De La Batte'],
      errors: ['les prénoms ne matchent pas (Hubert Bonisseur vs Hubert Bonisseur III)'],
    },
    {
      psychologist: ['5', ADELI_ID, 'Hubert Bonisseur', 'De La Batte'],
      errors: ['les prénoms ne matchent pas (Humberto vs Hubert Bonisseur)'],
    },
    {
      psychologist: ['123', ADELI_ID, 'jane', 'doe'],
      errors: [],
    },
    {
      psychologist: ['1 2 3', ADELI_ID, 'jane', 'doe'],
      errors: [],
    },
  ];

  useCases.forEach((useCase) => {
    it(`Should ${useCase.errors.length > 0 ? 'refuse' : 'accept'} ${useCase.psychologist.join()}`, () => {
      const psychologist = clean.getOnePsyDS(...useCase.psychologist);
      const errors = getAdeliErrors(psychologist, adeliInfo);
      errors.length.should.equals(useCase.errors.length);
      useCase.errors.forEach((error, index) => error.should.equals(errors[index]));
    });
  });
});
