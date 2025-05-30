import create from '../helper/create';
import getDiplomaErrors from '../../services/getDiplomaErrors';

describe('getDiplomaErrors', () => {
  const DIPLOMA_ID = 'Q2hhbXAtMTYzOTE2OQ==';
  const currentYear = new Date().getFullYear();

  it('Should refuse empty diploma', () => {
    const psychologist = create.getOnePsyDS('2000', 'random');

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('pas d\'année d\'obtention du diplôme');
  });

  it('Should refuse non year diploma', () => {
    const psychologist = create.getOnePsyDS('not a year', DIPLOMA_ID);

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('le diplôme est trop récent');
  });

  it('Should refuse recent diploma', () => {
    const threeYearsAgo = currentYear - 3;
    const psychologist = create.getOnePsyDS(threeYearsAgo.toString(), DIPLOMA_ID);

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('le diplôme est trop récent');
  });

  it('Should accept old diploma', () => {
    const psychologist = create.getOnePsyDS('2000', DIPLOMA_ID);

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(0);
  });
});
