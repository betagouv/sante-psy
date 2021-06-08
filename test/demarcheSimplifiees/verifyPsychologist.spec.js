const rewire = require('rewire');
const sinon = require('sinon');

const demarchesSimplifiees = rewire('../../services/demarchesSimplifiees');
const graphql = require('../../utils/graphql');

describe('getDiplomaErrors', () => {
  const createPsyWithDiploma = (year, id = 'Q2hhbXAtMTYzOTE2OQ==') => ({
    champs: [{
      id,
      stringValue: year,
    }],
  });

  const getDiplomaErrors = demarchesSimplifiees.__get__('getDiplomaErrors');
  it('Should refuse empty diploma', () => {
    const psychologist = createPsyWithDiploma('2000', 'random');

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('Diploma year missing');
  });

  it('Should refuse non year diploma', () => {
    const psychologist = createPsyWithDiploma('not a year');

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('Diploma is too recent');
  });

  it('Should refuse recent diploma', () => {
    const psychologist = createPsyWithDiploma('2020');

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('Diploma is too recent');
  });

  it('Should accept old diploma', () => {
    const psychologist = createPsyWithDiploma('2000');

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(0);
  });
});

describe('getAdeliErrors', () => {
  const adeliInfo = {
    123: {
      'Identifiant PP': '123',
      "Nom d'exercice": 'Doe',
      "Prénom d'exercice": 'Jane',
      'Code profession': 73,
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
  const createPsy = (firstName, lastName, adeli, adeliId = 'Q2hhbXAtMTYyNjk4Nw==') => ({
    champs: [{
      id: adeliId,
      stringValue: adeli,
    }],
    demandeur: {
      nom: lastName,
      prenom: firstName,
    },
  });

  const getAdeliErrors = demarchesSimplifiees.__get__('getAdeliErrors');
  it('Should refuse missing adeli number', () => {
    const psychologist = createPsy('jane', 'doe', 'non existing');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(1);
    errors[0].should.equals('No info found for this Adeli number');
  });

  it('Should refuse non psychologue', () => {
    const psychologist = createPsy('john', 'doe', '456');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(1);
    errors[0].should.equals('Person is not a Psychologue but a Magicien');
  });

  it('Should refuse missmatching name', () => {
    const psychologist = createPsy('john', 'doe', '123');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(1);
    errors[0].should.equals('First name does not match (Jane <> john)');
  });

  it('Should return all missmatching info', () => {
    const psychologist = createPsy('Georges', 'Moustaki', '456');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(3);
    errors[0].should.equals('Person is not a Psychologue but a Magicien');
    errors[1].should.equals('First name does not match (John <> Georges)');
    errors[2].should.equals('Last name does not match (Doe <> Moustaki)');
  });

  it('Should accept perfect match', () => {
    const psychologist = createPsy('jane', 'doe', '123');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(0);
  });
});

describe('verifyPsychologist', () => {
  let getAdeliErrorsStub;
  let getDiplomaErrorsStub;
  let putDossierInInstructionStub;
  let addVerificationMessageStub;

  let unsets = [];
  beforeEach(() => {
    unsets = [];
    getAdeliErrorsStub = sinon.stub();
    getDiplomaErrorsStub = sinon.stub();
    putDossierInInstructionStub = sinon.stub(graphql, 'putDossierInInstruction');
    addVerificationMessageStub = sinon.stub(graphql, 'addVerificationMessage');
    unsets.push(demarchesSimplifiees.__set__('getAdeliErrors', getAdeliErrorsStub));
    unsets.push(demarchesSimplifiees.__set__('getDiplomaErrors', getDiplomaErrorsStub));
  });

  afterEach((done) => {
    putDossierInInstructionStub.restore();
    addVerificationMessageStub.restore();
    unsets.forEach((unset) => unset());
    done();
  });

  const verifyPsychologist = demarchesSimplifiees.__get__('verifyPsychologist');
  it('Should call putDossierInInstruction if no errors', () => {
    getAdeliErrorsStub.returns([]);
    getDiplomaErrorsStub.returns([]);

    const result = verifyPsychologist({ id: 123 }, {});

    result.should.equals(true);
    sinon.assert.called(getAdeliErrorsStub);
    sinon.assert.called(getDiplomaErrorsStub);
    sinon.assert.calledWith(putDossierInInstructionStub,
      123,
      sinon.match((message) => message.startsWith(
        `Dossier vérifié automatiquement le ${(new Date()).toDateString()}`,
      )));
    sinon.assert.notCalled(addVerificationMessageStub);
  });

  it('Should call addVerificationMessage if errors', () => {
    getAdeliErrorsStub.returns(['error 1', 'error 2']);
    getDiplomaErrorsStub.returns(['error 3', 'error 4']);

    const result = verifyPsychologist({ id: 123 }, {});

    result.should.equals(false);
    sinon.assert.called(getAdeliErrorsStub);
    sinon.assert.called(getDiplomaErrorsStub);
    sinon.assert.calledWith(addVerificationMessageStub,
      123,
      sinon.match((message) => message.startsWith(
        `Le dossier n'a pas passé la vérification automatique le ${(new Date()).toDateString()}`,
      )
      && message.endsWith('car error 3,error 4,error 1,error 2')));
    sinon.assert.notCalled(putDossierInInstructionStub);
  });
});
