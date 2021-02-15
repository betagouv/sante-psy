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
  const apiResponse = await graphql.requestPsychologist(cursor);

  const nextCursor = getNextCursor(apiResponse);

  const nextAccumulator = accumulator.concat(
    parsePsychologist(apiResponse)
  );

  if( nextCursor ) {
    return getAllPsychologistList(nextCursor, nextAccumulator);
  } else {
    return {
      psychologists : nextAccumulator,
      lastCursor: cursor
    };
  }
}

/**
 * 
 * @return {
      psychologists : psychologist List,
      lastCursor: last cursor from DS API
    }
 */
async function getPsychologistList(cursor) {
  const time = `getting all psychologists from DS (query id #${Math.random().toString()})`;
  console.time(time);
  const psychologists = await getAllPsychologistList(cursor);
  console.timeEnd(time);

  return psychologists;
}

exports.getPsychologistList = getPsychologistList;

/**
 * @param api reponse with 2 informations :
 * hasNextPage: boolean
 * endCursor : string
 */
function getNextCursor(apiResponse) {
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

function getChampValue(champData, attributeName, stringValue = true) {
  const potentialStringValue = champData.find(champ => champ.label === attributeName);

  if(typeof potentialStringValue === 'undefined') {
    console.warn(`Champ from API ${attributeName} does not exist`);

    return "";
  } else {
    if(stringValue) {
      return potentialStringValue.stringValue;
    } else {
      return potentialStringValue.value;
    }
  }
}

/**
 * transform string to boolean
 * @param {*} inputString 'true' or 'false' 
 */
function parseTeleconsultation(inputString) {
  return inputString === 'true';
}

/**
 * transform string "speciality1, speciality2" to array ["speciality1", "speciality2"]
 */
function parseTraining(inputString) {
  if(inputString.includes(',')) {
    return inputString.split(', ');
  } else {
    return [inputString];
  }
}

function parseDossierMetadata(dossier) {
  const name = getName(dossier.demandeur);
  const region = dossier.groupeInstructeur.label; // Normandie
  const address = getChampValue(dossier.champs, 'Adresse du cabinet');
  const county = getChampValue(dossier.champs, 'Votre département', false); // "14 - Calvados"
  const phone =  getChampValue(dossier.champs, 'Téléphone du secrétariat');
  const teleconsultation = parseTeleconsultation(
    getChampValue(dossier.champs, 'Proposez-vous de la téléconsultation ?')
  );
  const website =  getChampValue(dossier.champs, 'Site web professionnel (optionnel)');
  const email =  getChampValue(dossier.champs, 'Email de contact');
  const description =  getChampValue(dossier.champs, 'Paragraphe de présentation (optionnel)');
  const training = parseTraining(
    getChampValue(dossier.champs, 'Formations et expériences')
  );
  const adeliNumber = getChampValue(dossier.champs, 'Numéro Adeli')
  const diploma = getChampValue(dossier.champs, 'Intitulé ou spécialité de votre master de psychologie')

  const psy = {
    name,
    address,
    region,
    county,
    phone,
    website,
    email,
    teleconsultation,
    description,
    training,
    adeliNumber,
    diploma
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