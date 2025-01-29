import dotEnv from 'dotenv';
import { expect } from 'chai';
import sinon from 'sinon';
import config from '../../utils/config';
import dbPsychologists from '../../db/psychologists';
import dbUniversities from '../../db/universities';
import dbDsApiCursor from '../../db/dsApiCursor';
import importDossier from '../../services/demarchesSimplifiees/importDossier';
import cronDemarchesSimplifiees from '../../cron_jobs/cronDemarchesSimplifiees';
import clean from '../helper/clean';
import create from '../helper/create';
import { DossierState } from '../../types/DossierState';

const sendEmail = require('../../utils/email');

dotEnv.config();

describe('Import Data from DS to PG', () => {
  let getLatestCursorSavedStub;
  let getPsychologistListStub;
  let savePsychologistInPGStub;
  let getNumberOfPsychologistsStub;
  let saveLatestCursorStub;

  afterEach(async () => {
    getLatestCursorSavedStub.restore();
    getPsychologistListStub.restore();
    savePsychologistInPGStub.restore();
    getNumberOfPsychologistsStub.restore();
    saveLatestCursorStub.restore();
    return Promise.resolve();
  });

  it('should get a cursor, then all psychologist from DS API, then save cursor and psylist', async () => {
    // eslint-disable-next-line max-len
    const cursor = '{"id":1,"cursor":"test","createdAt":"2021-02-19T13:16:45.382Z","updatedAt":"2021-02-19T13:16:45.380Z"}';
    const dsApiData = {
      psychologists: [create.getOnePsy()],
      cursor: 'test',
    };
    getLatestCursorSavedStub = sinon.stub(dbDsApiCursor, 'getLatestCursorSaved')
      .returns(Promise.resolve(cursor));
    getPsychologistListStub = sinon.stub(importDossier, 'getPsychologistList')
      .returns(Promise.resolve(dsApiData));
    savePsychologistInPGStub = sinon.stub(dbPsychologists, 'upsertMany')
      .returns(Promise.resolve());
    getNumberOfPsychologistsStub = sinon.stub(dbPsychologists, 'countByArchivedAndState')
      .returns(Promise.resolve([{ count: 1 }]));
    saveLatestCursorStub = sinon.stub(dbDsApiCursor, 'saveLatestCursor')
    .returns(Promise.resolve());

    await cronDemarchesSimplifiees.importLatestDataFromDSToPG();

    sinon.assert.called(getLatestCursorSavedStub);
    sinon.assert.called(getPsychologistListStub);
    sinon.assert.called(savePsychologistInPGStub);
    sinon.assert.called(saveLatestCursorStub);
    sinon.assert.called(getNumberOfPsychologistsStub);
  });
});

describe('checkForMultipleAcceptedDossiers', () => {
  let sendMailStub;

  beforeEach(async () => {
    sendMailStub = sinon.stub(sendEmail, 'default');
    await clean.psychologists();
    return Promise.resolve();
  });

  afterEach(async () => {
    await clean.psychologists();
    sendMailStub.restore();
    return Promise.resolve();
  });

  it('should notify if two accepted dossiers for the same person', async () => {
    // insert 2 psychologists, same data except uuid, with accepte state
    const psy = create.getOnePsy();
    psy.state = DossierState.accepte;
    psy.dossierNumber = '27172a9b-5081-4502-9022-b17510ba40a1';
    await dbPsychologists.upsertMany([psy]);
    psy.dossierNumber = '0fee0788-b4fe-49f5-a950-5d22a343d495';
    await dbPsychologists.upsertMany([psy]);

    const psyArray = await dbPsychologists.getAllActive();
    expect(psyArray).to.have.length(2);

    await cronDemarchesSimplifiees.checkForMultipleAcceptedDossiers();

    sinon.assert.called(sendMailStub);
    sinon.assert.calledWith(
      sendMailStub,
      sinon.match(config.teamEmail), // toEmail
      sinon.match.string, // subject : any
      sinon.match(psy.personalEmail),
    ); // body contains personalEmail
  });
});

describe('DS integration tests', () => {
  // warning: DS datas (test account) erase every 3,5 years, might create tests bug
  // get below dossierNumber via log of dsAPIData
  const anaisId = 'a8f759ce-3a30-52ae-a95e-2551d5cc5910';
  const anais = {
    adeli: '012345678',
    title: 'Mme',
    firstNames: 'Anais',
    lastName: 'Alt',
    email: 'anais.altun@beta.gouv.fr',
    address: '1 Rue Lecourbe 75015 Paris',
    departement: '75 - Paris',
    longitude: null, // api-adresse.data.gouv.fr is mocked in test
    latitude: null, // api-adresse.data.gouv.fr is mocked in test
    city: null,
    postcode: null,
    otherAddress: null,
    otherLongitude: null,
    otherLatitude: null,
    otherCity: null,
    otherPostcode: null,
    region: 'Ile-de-France',
    phone: '01 02 03 04 05',
    website: '',
    appointmentLink: null,
    teleconsultation: false,
    description: '',
    languages: 'Français',
    training: [''],
    diploma: 'Psychologie',
    diplomaYear: '2005',
    archived: false,
    state: DossierState.accepte,
    personalEmail: 'anais.altun@beta.gouv.fr',
    isConventionSigned: null,
    selfModified: false,
    hasSeenTutorial: false,
    acceptationDate: new Date('2025-01-29T00:00:00.000Z'),
  };
  const doniaId = 'a767ecdf-e565-5c1b-8169-e95116e8d126';
  const donia = {
    adeli: '95829302942',
    title: 'Mme',
    firstNames: 'Donia',
    lastName: 'Benharara',
    email: 'donia.benharara@beta.gouv.fr',
    address: '10 Avenue Simon Vouet 78560 Le Port-Marly',
    departement: '78 - Yvelines',
    region: 'Ile-de-France',
    longitude: null, // api-adresse.data.gouv.fr is mocked in test
    latitude: null, // api-adresse.data.gouv.fr is mocked in test
    city: null,
    postcode: null,
    otherAddress: null,
    otherLongitude: null,
    otherLatitude: null,
    otherCity: null,
    otherPostcode: null,
    phone: '06 12 34 56 78',
    website: '',
    appointmentLink: null,
    teleconsultation: false,
    description: '',
    languages: 'Français',
    training: ['Psychologie Clinique', 'Psychopathologie et/ou Psychologie de la santé'],
    diploma: 'Psychologie clinique de la santé',
    diplomaYear: '2015',
    archived: false,
    state: DossierState.accepte,
    personalEmail: 'donia.benharara@beta.gouv.fr',
    isConventionSigned: null,
    selfModified: false,
    hasSeenTutorial: false,
    acceptationDate: new Date('2025-01-29T00:00:00.000Z'),
  };

  beforeEach(async () => {
    await clean.psychologists();
  });

  const verifyPsy = async (id, expected, universityId = undefined) => {
    const {
      createdAt,
      updatedAt,
      dossierNumber,
      inactiveUntil,
      active,
      assignedUniversityId,
      useFirstNames,
      useLastName,
      isVeryAvailable,
      ...psy
    } = await dbPsychologists.getById(id);
    psy.should.eql(expected);
    if (universityId) {
      assignedUniversityId.should.equals(universityId);
    }
  };

  it('should import all data from DS', async () => {
    const result = await cronDemarchesSimplifiees.importEveryDataFromDSToPG();
    result.should.be.true;

    await verifyPsy(anaisId, anais);
    await verifyPsy(doniaId, donia);
  }).timeout(30000);

  it('should update psy info when existing', async () => {
    const paulUniversity = await dbUniversities.insertByName('PaulU');
    const xavierUniversity = await dbUniversities.insertByName('xavierU');

    // @ts-expect-error => test
    await dbPsychologists.upsertMany([{
      ...anais,
      training: JSON.stringify(anais.training),
      dossierNumber: anaisId,
      firstNames: 'Paulo',
      description: 'Biz dev indispensable le jour, master en deguisement la nuit',
      selfModified: false,
      assignedUniversityId: paulUniversity.id,
    },
    // @ts-expect-error => test
    {
      ...donia,
      training: JSON.stringify(donia.training),
      dossierNumber: doniaId,
      firstNames: 'Raviere',
      diploma: 'BTS de claquettes',
      description: 'Codeur vaudoo, prefere mettre en prod un vendredi soir plutot que de faire des tests',
      selfModified: true,
      assignedUniversityId: xavierUniversity.id,
    }]);

    const result = await cronDemarchesSimplifiees.importEveryDataFromDSToPG();
    result.should.be.true;

    await verifyPsy(anaisId, anais, paulUniversity.id);
    await verifyPsy(doniaId, {
      ...donia,
      description: 'Codeur vaudoo, prefere mettre en prod un vendredi soir plutot que de faire des tests',
      selfModified: true,
    }, xavierUniversity.id);
  }).timeout(30000);
});
