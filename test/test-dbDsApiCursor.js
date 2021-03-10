const assert = require('chai').assert;
require('dotenv').config();
const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig);
const dbDsApiCursor = require('../db/dsApiCursor')
const date = require('../utils/date');
const clean = require('./helper/clean');

describe('DB Ds Api Cursor', () => {
  //Clean up all data
  beforeEach(async function before() {
    console.log("cleaning cursor")
    await clean.cleanDataCursor();
  })

  describe('getLatestCursorSaved', () => {
    it('should return undefined if there is no cursor saved', async () => {
      const output = await dbDsApiCursor.getLatestCursorSaved();

      assert(output === undefined);
    });

    it('should return undefined if we do not want to use the cursor', async () => {
      const output = await dbDsApiCursor.getLatestCursorSaved(false);

      assert(output === undefined);
    });

    it('should return the latest cursor saved', async () => {
      const myCursor = "test"
      await knex(dbDsApiCursor.dsApiCursorTable)
      .insert({
        "id" : 1,
        "cursor": myCursor,
        "updatedAt": date.getDateNowPG()
      }).returning('*');

      const output = await dbDsApiCursor.getLatestCursorSaved();

      assert(output, myCursor);
    });
  });
});