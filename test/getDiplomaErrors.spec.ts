import clean from './helper/clean';
import getDiplomaErrors from '../services/getDiplomaErrors';

describe('getDiplomaErrors', () => {
  const DIPLOMA_ID = 'Q2hhbXAtMTYzOTE2OQ==';

  it('Should refuse empty diploma', () => {
    const psychologist = clean.getOnePsyDS('2000', 'random');

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('pas d\'année d\'obtention du diplôme');
  });

  it('Should refuse non year diploma', () => {
    const psychologist = clean.getOnePsyDS('not a year', DIPLOMA_ID);

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('le diplôme est trop récent');
  });

  it('Should refuse recent diploma', () => {
    const psychologist = clean.getOnePsyDS('2020', DIPLOMA_ID);

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('le diplôme est trop récent');
  });

  it('Should accept old diploma', () => {
    const psychologist = clean.getOnePsyDS('2000', DIPLOMA_ID);

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(0);
  });
});
