require('dotenv').config();
const config = require('../utils/config')
const dbPsychologists = require('../db/psychologists')
const dbDsApiCursor = require('../db/dsApiCursor')
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');
const emailUtils = require('../utils/email');
const { expect } = require('chai')
const rewire = require('rewire')
const cronDemarchesSimplifiees = rewire('../cron_jobs/cronDemarchesSimplifiees');
const clean = require("./helper/clean");
const sinon = require('sinon');

describe('Import Data from DS to PG', () => {
  let getLatestCursorSavedStub
  let getPsychologistListStub
  let savePsychologistInPGStub
  let getNumberOfPsychologistsStub

  afterEach(async () => {
    getLatestCursorSavedStub.restore()
    getPsychologistListStub.restore()
    savePsychologistInPGStub.restore()
    getNumberOfPsychologistsStub.restore()
    return Promise.resolve()
  })

  it('should get a cursor, then all psychologist from DS API, then save cursor and psylist', async () => {
    const importDataFromDSToPG = cronDemarchesSimplifiees.__get__('importDataFromDSToPG');

    // eslint-disable-next-line max-len
    const cursor = '{"id":1,"cursor":"test","createdAt":"2021-02-19T13:16:45.382Z","updatedAt":"2021-02-19T13:16:45.380Z"}';
    const dsApiData = {
      psychologists: clean.psyList(),
      cursor: "test"
    }
    getLatestCursorSavedStub = sinon.stub(dbDsApiCursor, 'getLatestCursorSaved')
      .returns(Promise.resolve(cursor));
    getPsychologistListStub = sinon.stub(demarchesSimplifiees, 'getPsychologistList')
      .returns(Promise.resolve(dsApiData));
    savePsychologistInPGStub = sinon.stub(dbPsychologists, 'savePsychologistInPG')
      .returns(Promise.resolve());
    getNumberOfPsychologistsStub = sinon.stub(dbPsychologists, 'getNumberOfPsychologists')
      .returns(Promise.resolve([{count:1}]));
    let saveLatestCursorStub = sinon.stub(dbDsApiCursor, 'saveLatestCursor')
    .returns(Promise.resolve());

    await importDataFromDSToPG();

    sinon.assert.called(getLatestCursorSavedStub);
    sinon.assert.called(getPsychologistListStub);
    sinon.assert.called(savePsychologistInPGStub);
    sinon.assert.called(saveLatestCursorStub);
    sinon.assert.called(getNumberOfPsychologistsStub);
  });
});

describe('checkForMultipleAcceptedDossiers', () => {
  let sendMailStub

  beforeEach(async () => {
    sendMailStub = sinon.stub(emailUtils, 'sendMail')
    await clean.cleanAllPsychologists()
    return Promise.resolve()
  })

  afterEach(async () => {
    await clean.cleanAllPsychologists()
    sendMailStub.restore()
    return Promise.resolve()
  })

  it('should notify if two accepted dossiers for the same person', async () => {
    // insert 2 psychologists, same data except uuid, with accepte state
    const psyList = clean.psyList()
    psyList[0].state = 'accepte'
    psyList[0].dossierNumber = '27172a9b-5081-4502-9022-b17510ba40a1'
    await dbPsychologists.savePsychologistInPG(psyList)
    psyList[0].dossierNumber = '0fee0788-b4fe-49f5-a950-5d22a343d495'
    await dbPsychologists.savePsychologistInPG(psyList)

    const psyArray = await dbPsychologists.getPsychologists()
    expect(psyArray).to.have.length(2)

    await cronDemarchesSimplifiees.checkForMultipleAcceptedDossiers()

    sinon.assert.called(sendMailStub)
    sinon.assert.calledWith(sendMailStub,
      sinon.match(config.teamEmail), // toEmail
      sinon.match.string, // subject : any
      sinon.match(psyList[0].personalEmail)); // body contains personalEmail
  })
})
