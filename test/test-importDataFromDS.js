require('dotenv').config();
const dbPsychologists = require('../db/psychologists')
const dbDsApiCursor = require('../db/dsApiCursor')
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');
const importDataFromDS = require('../cron_jobs/importDataFromDS');
const clean = require("./helper/clean");
const sinon = require('sinon');

describe('Import Data from DS to PG', () => {
  it('should get a cursor, then all psychologist from DS API, then save cursor and psylist', async () => {
    // eslint-disable-next-line max-len
    const cursor = '{"id":1,"cursor":"test","createdAt":"2021-02-19T13:16:45.382Z","updatedAt":"2021-02-19T13:16:45.380Z"}';
    const dsApiData = {
      psychologists: clean.psyList(),
      cursor: "test"
    }
    let getLatestCursorSavedStub = sinon.stub(dbDsApiCursor, 'getLatestCursorSaved')
    .returns(Promise.resolve(cursor));
    let getPsychologistListStub = sinon.stub(demarchesSimplifiees, 'getPsychologistList')
    .returns(Promise.resolve(dsApiData));
    let savePsychologistInPGStub = sinon.stub(dbPsychologists, 'savePsychologistInPG')
    .returns(Promise.resolve());
    let getNumberOfPsychologistsStub = sinon.stub(dbPsychologists, 'getNumberOfPsychologists')
    .returns(Promise.resolve({count:1}));
    let saveLatestCursorStub = sinon.stub(dbDsApiCursor, 'saveLatestCursor')
    .returns(Promise.resolve());

    await importDataFromDS.importDataFromDSToPG()

    sinon.assert.called(getLatestCursorSavedStub);
    sinon.assert.called(getPsychologistListStub);
    sinon.assert.called(savePsychologistInPGStub);
    sinon.assert.called(saveLatestCursorStub);
    sinon.assert.called(getNumberOfPsychologistsStub);
  });
});