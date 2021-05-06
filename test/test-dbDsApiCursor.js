const { assert } = require('chai');
require('dotenv').config();
const dbDsApiCursor = require('../db/dsApiCursor');
const clean = require('./helper/clean');

describe('DB Ds Api Cursor', () => {
  // Clean up all data
  beforeEach(async () => {
    await clean.cleanDataCursor();
  });

  describe('getLatestCursorSaved', () => {
    it('should return undefined if there is no cursor saved', async () => {
      const output = await dbDsApiCursor.getLatestCursorSaved();

      assert.isUndefined(output);
    });

    it('should return undefined if we do not want to use the cursor', async () => {
      const output = await dbDsApiCursor.getLatestCursorSaved(false);

      assert.isUndefined(output);
    });

    it('should return the latest cursor saved', async () => {
      const myCursor = 'test';
      await dbDsApiCursor.saveLatestCursor(myCursor);

      const output = await dbDsApiCursor.getLatestCursorSaved();

      assert.strictEqual(output, myCursor);
    });
  });
});
