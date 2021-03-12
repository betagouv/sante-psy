const rewire = require("rewire");
const demarchesSimplifiees = rewire('../../utils/demarchesSimplifiees');

module.exports.getCsrfTokenHtml = function getCsrfToken(request) {
  return request.res.text.split('<input type="hidden" name="_csrf" value="')[1].split('">')[0];
}

module.exports.getCsrfTokenCookie = function getCsrfToken(request) {
  return request.headers['set-cookie'];
}

module.exports.testDossierNumber = function getTestDossierNumber() {
  const getUuidDossierNumber = demarchesSimplifiees.__get__('getUuidDossierNumber');
  return getUuidDossierNumber(1);
}

module.exports.psyListFromDS = function psyListFromDS() {
  return [
    {
      dossierNumber: module.exports.testDossierNumber(),
      firstNames: 'First second',
      lastName: 'Last',
      archived : false,
      state : 'accepte',
      adeli: "829302942",
      address: 'SSR CL AL SOLA 66110 MONTBOLO',
      diploma: "Psychologie clinique de la santé",
      phone: '0468396600',
      email: 'psychologue.TEST@beta.gouv.fr', // emails can have uppercase in DS
      personalEmail: 'loginEmail@beta.gouv.fr', // emails can have uppercase in DS
      website: 'apas82.mssante.fr',
      teleconsultation: true,
      description: "description",
      // eslint-disable-next-line max-len
      training: "[\"Connaissance et pratique des outils diagnostic psychologique\",\"Connaissance des troubles psychopathologiques du jeune adulte : dépressions\",\"risques suicidaires\",\"addictions\",\"comportements à risque\",\"troubles alimentaires\",\"décompensation schizophrénique\",\"psychoses émergeantes ainsi qu’une pratique de leur repérage\",\"Connaissance et pratique des dispositifs d’accompagnement psychologique et d’orientation (CMP...)\"]",
      departement: "14 - Calvados",
      region: "Normandie",
      languages: "Français ,Anglais, et Espagnol"
    }];
}
