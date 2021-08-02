import clean from './helper/clean';
import getAdeliErrors from '../services/getAdeliErrors';
import { DSPsychologist } from '../types/Psychologist';

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
  };

  const ADELI_ID = 'Q2hhbXAtMTYyNjk4Nw==';

  it('Should refuse missing adeli number', () => {
    const psychologist : DSPsychologist = clean.getOnePsyDS('non existing', ADELI_ID, 'jane', 'doe');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(1);
    errors[0].should.equals('pas de correspondance pour ce numéro Adeli');
  });

  it('Should refuse non psychologue', () => {
    const psychologist : DSPsychologist = clean.getOnePsyDS('456', ADELI_ID, 'john', 'doe');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(1);
    errors[0].should.equals('la personne n\'est pas un psychologue mais un Magicien');
  });

  it('Should refuse missmatching name', () => {
    const psychologist : DSPsychologist = clean.getOnePsyDS('123', ADELI_ID, 'john', 'doe');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(1);
    errors[0].should.equals('les prénoms ne matchent pas (Jane vs john)');
  });

  it('Should return all missmatching info', () => {
    const psychologist : DSPsychologist = clean.getOnePsyDS('456', ADELI_ID, 'Georges', 'Moustaki');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(3);
    errors[0].should.equals('la personne n\'est pas un psychologue mais un Magicien');
    errors[1].should.equals('les prénoms ne matchent pas (John vs Georges)');
    errors[2].should.equals('le nom ne matche pas (Doe vs Moustaki)');
  });

  it('Should accept perfect match', () => {
    const psychologist : DSPsychologist = clean.getOnePsyDS('123', ADELI_ID, 'jane', 'doe');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(0);
  });
});
