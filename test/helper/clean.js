const knexConfig = require("../../knexfile");
const knex = require("knex")(knexConfig);
const dbPsychologists = require('../../db/psychologists')
const dbDsApiCursor = require('../../db/dsApiCursor')
const rewire = require("rewire");
const demarchesSimplifiees = rewire('../../utils/demarchesSimplifiees');

const getUuidDossierNumber = demarchesSimplifiees.__get__('getUuidDossierNumber');

module.exports.testDossierNumber = getUuidDossierNumber(1);
module.exports.psyList = [
  {
    dossierNumber: module.exports.testDossierNumber ,
    firstNames: 'First second',
    lastName: 'Last',
    adeli: "829302942",
    address: 'SSR CL AL SOLA 66110 MONTBOLO',
    diploma: "Psychologie clinique de la santé",
    phone: '0468396600',
    email: 'psychologue.test@apas82.mssante.fr',
    website: 'apas82.mssante.fr',
    teleconsultation: true,
    description: "description",
    // eslint-disable-next-line max-len
    training: "[\"Connaissance et pratique des outils diagnostic psychologique\",\"Connaissance des troubles psychopathologiques du jeune adulte : dépressions\",\"risques suicidaires\",\"addictions\",\"comportements à risque\",\"troubles alimentaires\",\"décompensation schizophrénique\",\"psychoses émergeantes ainsi qu’une pratique de leur repérage\",\"Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)\"]",
    departement: "14 - Calvados",
    region: "Normandie",
    languages: "Français ,Anglais, et Espagnol"
  }];

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