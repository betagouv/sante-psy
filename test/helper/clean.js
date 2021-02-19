const knexConfig = require("../../knexfile");
const knex = require("knex")(knexConfig);
const dbPsychologists = require('../../db/psychologists')
const dbDsApiCursor = require('../../db/dsApiCursor')

module.exports.cleanDataCursor = async function cleanDataCursor() {
  try {
    const ifExist = await knex(dbDsApiCursor.dsApiCursorTable)
        .where('id', 1)
        .first();

    if (ifExist) {
      await knex(dbDsApiCursor.dsApiCursorTable)
          .where('id', 1)
          .del();
    } else {
      undefined;
    }
  } catch (err) {
    console.log(err);
  }
}

module.exports.cleanDataPsychologist = async function cleanDataPsychologist(dossierNumber) {
  try {
    const ifExist = await knex(dbPsychologists.psychologistsTable)
    .where('dossierNumber', dossierNumber)
    .first();

    if (ifExist) {
      const clean = await knex(dbPsychologists.psychologistsTable)
        .where('dossierNumber', dossierNumber)
        .del();
      console.log("cleaned");

      return clean;
    }
  } catch (err) {
    console.log(err);
  }
}