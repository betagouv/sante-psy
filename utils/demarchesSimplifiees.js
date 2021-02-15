const graphql = require('../utils/graphql');
const _ = require('lodash');

/**
 * get all psychologist from DS API
 * 
 * DS API return 100 elements maximum
 * if we have more than 100 elements in DS, we have to use pagination (cursor)
 * cursor : String - next page to query the API
 */
async function getAllPsychologistList(cursor, accumulator = []) {
  // get data from DS API
  const apiResponse = await graphql.requestPsychologist(cursor);

  // do we have a next page to query ?
  const nextCursor = getHasNextPage(apiResponse);

  // let's save what the API returned us in an array
  const nextAccumulator = accumulator.concat(
    parsePsychologist(apiResponse)
  );

  // if we have a next page to query, use the next cursor and don't forget our saved accumulator to be passed on
  if( nextCursor ) {
    return getAllPsychologistList(nextCursor, nextAccumulator);
  } else {
    return nextAccumulator;
  }
}

async function getPsychologistList() {
  const time = `displaying all psychologists from DS (query id #${Math.random().toString()})`;
  console.time(time);
  const psychologists = await getAllPsychologistList();
  console.timeEnd(time);

  return psychologists;
}
exports.getPsychologistList = getPsychologistList;

/**
 * @param api reponse with 2 informations :
 * hasNextPage: boolean
 * endCursor : string
 */
function getHasNextPage(apiResponse) {
  const pageInfo = apiResponse.demarche.dossiers.pageInfo;
  if( pageInfo.hasNextPage ) {
    return pageInfo.endCursor;
  } else {
    return undefined;
  }
}

/**
 * Converts the first character of first name and last name to upper case and the remaining to lower case.
 * @param {*} demandeur 
 */
function getName(demandeur) {
  return _.capitalize(demandeur.prenom) + ' ' + _.capitalize(demandeur.nom);
}

function getChampValue(champData, attributeName) {
  const potentialStringValue = champData.find(champ => champ.label === attributeName);

  if(typeof potentialStringValue === 'undefined') {
    console.warn(`Champ from API ${attributeName} does not exist`);

    return "";
  } else {
    return potentialStringValue.stringValue;
  }
}

/**
 * transform string to boolean
 * @param {*} inputString 'true' or 'false' 
 */
function parseTeleconsultation(inputString) {
  return inputString === 'true';
}

function parseDossierMetadata(dossier) {
  const name = getName(dossier.demandeur);
  const university = dossier.groupeInstructeur.label.stringValue;
  const address = getChampValue(dossier.champs, 'Adresse du cabinet');
  const phone =  getChampValue(dossier.champs, 'Téléphone du secrétariat');
  const teleconsultation = parseTeleconsultation(
    getChampValue(dossier.champs, 'Proposez-vous de la téléconsultation ?')
  );
  const website =  getChampValue(dossier.champs, 'Site web professionnel (optionnel)');
  const email =  getChampValue(dossier.champs, 'Email de contact');
  const description =  getChampValue(dossier.champs, 'Paragraphe de présentation (optionnel)');

  const psy = {
    name,
    address,
    phone,
    website,
    email,
    teleconsultation,
    description
  };

  return psy;
}

function parsePsychologist(apiResponse) {
  console.debug(`Parsing ${apiResponse.demarche.dossiers.nodes.length} psychologists from DS API`);

  const dossiers = apiResponse.demarche.dossiers.nodes

  if(dossiers.length > 0) {
    const psychologists = dossiers.map(dossier => {
      return parseDossierMetadata(dossier);
    });

    return psychologists;
  } else {
    console.error('Aucun psychologiste trouvé.');

    return [];
  }
}