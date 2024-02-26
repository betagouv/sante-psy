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

describe.only('DS integration tests', () => {
  const paulId = '036e3a85-24bf-5915-9db0-a189bec8e7f6';
  const paul = {
    adeli: '1234567890',
    firstNames: 'Paul',
    lastName: 'Burgun',
    email: 'paul.burgun@beta.gouv.fr',
    address: '1 Rue Lecourbe 75015 Paris',
    departement: '2B - Haute-Corse',
    longitude: null, // api-adresse.data.gouv.fr is mocked in test
    latitude: null, // api-adresse.data.gouv.fr is mocked in test
    city: null,
    postcode: null,
    otherAddress: null,
    otherLongitude: null,
    otherLatitude: null,
    otherCity: null,
    otherPostcode: null,
    region: 'Corse',
    phone: '01 23 45 67 89',
    website: '',
    appointmentLink: '',
    teleconsultation: false,
    description: 'Test',
    languages: 'Français',
    training: ['Connaissance et pratique des outils diagnostic psychologique'],
    diploma: 'Psychologue',
    archived: false,
    state: DossierState.accepte,
    personalEmail: 'paul.burgun@beta.gouv.fr',
    isConventionSigned: null,
    selfModified: false,
    hasSeenTutorial: false,
    acceptationDate: new Date('2021-06-04T00:00:00.000Z'),
  };
  const xavierId = '03ce077a-84c3-5035-9b27-f31a78a19b3a';
  const xavier = {
    adeli: '123456789',
    firstNames: 'Xavier',
    lastName: 'Dsdr',
    email: 'xavier.desoindre@beta.gouv.fr',
    address: 'Traverse C Est Ici 13380 Plan-de-Cuques',
    departement: '99 - Etranger',
    region: null, // not matching 99
    longitude: null, // api-adresse.data.gouv.fr is mocked in test
    latitude: null, // api-adresse.data.gouv.fr is mocked in test
    city: null,
    postcode: null,
    otherAddress: null,
    otherLongitude: null,
    otherLatitude: null,
    otherCity: null,
    otherPostcode: null,
    phone: '01',
    website: '',
    appointmentLink: '',
    teleconsultation: false,
    description: '',
    languages: 'Français',
    training: ['Connaissance et pratique des outils diagnostic psychologique'],
    diploma: 'T',
    archived: false,
    state: DossierState.accepte,
    personalEmail: 'xavier.desoindre@beta.gouv.fr',
    isConventionSigned: null,
    selfModified: false,
    hasSeenTutorial: false,
    acceptationDate: new Date('2021-06-01T00:00:00.000Z'),
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

    await verifyPsy(paulId, paul);
    await verifyPsy(xavierId, xavier);
  }).timeout(30000);

  it('should update psy info when existing', async () => {
    const paulUniversity = await dbUniversities.insertByName('PaulU');
    const xavierUniversity = await dbUniversities.insertByName('xavierU');

    // @ts-expect-error => test
    await dbPsychologists.upsertMany([{
      ...paul,
      training: JSON.stringify(paul.training),
      dossierNumber: paulId,
      firstNames: 'Paulo',
      description: 'Biz dev indispensable le jour, master en deguisement la nuit',
      selfModified: false,
      assignedUniversityId: paulUniversity.id,
    },
    // @ts-expect-error => test
    {
      ...xavier,
      training: JSON.stringify(xavier.training),
      dossierNumber: xavierId,
      firstNames: 'Raviere',
      diploma: 'BTS de claquettes',
      description: 'Codeur vaudoo, prefere mettre en prod un vendredi soir plutot que de faire des tests',
      selfModified: true,
      assignedUniversityId: xavierUniversity.id,
    }]);

    const result = await cronDemarchesSimplifiees.importEveryDataFromDSToPG();
    result.should.be.true;

    await verifyPsy(paulId, paul, paulUniversity.id);
    await verifyPsy(xavierId, {
      ...xavier,
      description: 'Codeur vaudoo, prefere mettre en prod un vendredi soir plutot que de faire des tests',
      selfModified: true,
    }, xavierUniversity.id);
  }).timeout(30000);
});
