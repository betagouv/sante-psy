const assert = require('chai').assert;
require('dotenv').config();
const dbDsApiCursor = require('../db/dsApiCursor')
const clean = require('./helper/clean');

describe('DB Ds Api Cursor', () => {
  //Clean up all data
  beforeEach(async function before() {
    await clean.cleanDataCursor();
  })

  describe('getLatestCursorSaved', () => {
    it('should return undefined if there is not', async () => {
      const output = await dbDsApiCursor.getLatestCursorSaved();

      assert(output === undefined);
    });

    it('should return undefined if we do not want to use the cursor', async () => {
      const output = await dbDsApiCursor.getLatestCursorSaved(false);

      assert(output === undefined);
    });

    it('should return the latest cursor saved', async () => {
      await dbDsApiCursor.saveLatestCursor("test");

      const output = await dbDsApiCursor.getLatestCursorSaved();
      assert(output, "test");
    });
  });
});