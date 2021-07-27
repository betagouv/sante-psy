const sinon = require('sinon');
const { default: graphql } = require('../../utils/graphql');

const autoVerifyPsychologists = require('../../services/demarchesSimplifiees/autoVerify');

describe('getDiplomaErrors', () => {
  const createPsyWithDiploma = (year, id = 'Q2hhbXAtMTYzOTE2OQ==') => ({
    champs: [{
      id,
      stringValue: year,
    }],
  });

  const getDiplomaErrors = autoVerifyPsychologists.__get__('getDiplomaErrors');
  it('Should refuse empty diploma', () => {
    const psychologist = createPsyWithDiploma('2000', 'random');

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('pas d\'année d\'obtention du diplôme');
  });

  it('Should refuse non year diploma', () => {
    const psychologist = createPsyWithDiploma('not a year');

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('le diplôme est trop récent');
  });

  it('Should refuse recent diploma', () => {
    const psychologist = createPsyWithDiploma('2020');

    const errors = getDiplomaErrors(psychologist);
    errors.length.should.equals(1);
    errors[0].should.equals('le diplôme est trop récent');
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

  const getAdeliErrors = autoVerifyPsychologists.__get__('getAdeliErrors');
  it('Should refuse missing adeli number', () => {
    const psychologist = createPsy('jane', 'doe', 'non existing');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(1);
    errors[0].should.equals('pas de correspondance pour ce numéro Adeli');
  });

  it('Should refuse non psychologue', () => {
    const psychologist = createPsy('john', 'doe', '456');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(1);
    errors[0].should.equals('la personne n\'est pas un psychologue mais un Magicien');
  });

  it('Should refuse missmatching name', () => {
    const psychologist = createPsy('john', 'doe', '123');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(1);
    errors[0].should.equals('les prénoms ne matchent pas (Jane vs john)');
  });

  it('Should return all missmatching info', () => {
    const psychologist = createPsy('Georges', 'Moustaki', '456');

    const errors = getAdeliErrors(psychologist, adeliInfo);
    errors.length.should.equals(3);
    errors[0].should.equals('la personne n\'est pas un psychologue mais un Magicien');
    errors[1].should.equals('les prénoms ne matchent pas (John vs Georges)');
    errors[2].should.equals('le nom ne matche pas (Doe vs Moustaki)');
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
  let addVerificationMessageStub;
  let verifyDossierStub;
  let putDossierInInstructionStub;

  let unsets = [];
  beforeEach(() => {
    unsets = [];
    getAdeliErrorsStub = sinon.stub();
    getDiplomaErrorsStub = sinon.stub();
    addVerificationMessageStub = sinon.stub(graphql, 'addVerificationMessage');
    verifyDossierStub = sinon.stub(graphql, 'verifyDossier');
    putDossierInInstructionStub = sinon.stub(graphql, 'putDossierInInstruction');
    unsets.push(autoVerifyPsychologists.__set__('getAdeliErrors', getAdeliErrorsStub));
    unsets.push(autoVerifyPsychologists.__set__('getDiplomaErrors', getDiplomaErrorsStub));
  });

  afterEach((done) => {
    addVerificationMessageStub.restore();
    verifyDossierStub.restore();
    putDossierInInstructionStub.restore();
    unsets.forEach((unset) => unset());
    done();
  });

  const verifyPsychologist = autoVerifyPsychologists.__get__('verifyPsychologist');
  it('Should call addVerificationMessage, verifyDossier and putDossierInInstruction if no errors', async () => {
    getAdeliErrorsStub.returns([]);
    getDiplomaErrorsStub.returns([]);

    const result = await verifyPsychologist({ id: 123 }, {});

    result.should.equals(true);
    sinon.assert.called(getAdeliErrorsStub);
    sinon.assert.called(getDiplomaErrorsStub);
    sinon.assert.calledOnce(addVerificationMessageStub);
    sinon.assert.calledWith(addVerificationMessageStub,
      123,
      sinon.match((message) => message.startsWith('Dossier vérifié automatiquement le ')));
    sinon.assert.calledWith(verifyDossierStub, 123);
    sinon.assert.calledWith(putDossierInInstructionStub, 123);
  });

  it('Should call addVerificationMessage if errors', async () => {
    getAdeliErrorsStub.returns(['error 1', 'error 2']);
    getDiplomaErrorsStub.returns(['error 3', 'error 4']);

    const result = await verifyPsychologist({ id: 123 }, {});

    result.should.equals(false);
    sinon.assert.called(getAdeliErrorsStub);
    sinon.assert.called(getDiplomaErrorsStub);
    sinon.assert.calledOnce(addVerificationMessageStub);
    sinon.assert.calledWith(addVerificationMessageStub,
      123,
      sinon.match((message) => message.startsWith('Le dossier n\'a pas passé la vérification automatique le ')
      && message.endsWith('car error 3,error 4,error 1,error 2')));
    sinon.assert.notCalled(verifyDossierStub);
    sinon.assert.notCalled(putDossierInInstructionStub);
  });
});
