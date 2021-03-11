const graphql = require('../utils/graphql');
const uuid = require('../utils/uuid');
const config = require('./config');

/**
 * helper function called by getPsychologistList
 * @param {*} cursor
 * @param {*} accumulator
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
 * get all psychologist from DS API
 *
 * DS API return 100 elements maximum
 * if we have more than 100 elements in DS, we have to use pagination (cursor)
 * cursor : String - next page to query the API
 */
async function getPsychologistList(cursor) {
  const time = `Fetching all psychologists from DS (query id #${Math.random().toString()})`;

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
 * as a JSON to store it inside PG
 */
function parseTraining(inputString) {
  if(inputString.includes(',')) {
    return JSON.stringify(inputString.split(', '));
  } else {
    return JSON.stringify([inputString]);
  }
}

function getUuidDossierNumber(number) {
  return uuid.generateUuidFromString(config.demarchesSimplifieesId + '-' + number);
}

function parseDossierMetadata(dossier) {
  const state = dossier.state;
  const archived = dossier.archived;
  const lastName = dossier.demandeur.nom;
  const firstNames = dossier.demandeur.prenom;
  const personalEmail = dossier.usager.email;
  const dossierNumber = getUuidDossierNumber(dossier.number);
  const region = dossier.groupeInstructeur.label;
  const address = getChampValue(dossier.champs, 'Adresse du cabinet');
  const departement = getChampValue(dossier.champs, 'Votre département'); // "14 - Calvados"
  const phone =  getChampValue(dossier.champs, 'Téléphone du secrétariat');
  const teleconsultation = parseTeleconsultation(
    getChampValue(dossier.champs, 'Proposez-vous de la téléconsultation ?')
  );
  const website =  getChampValue(dossier.champs, 'Site web professionnel (optionnel)');
  const email =  getChampValue(dossier.champs, 'Email de contact');
  const description =  getChampValue(dossier.champs, 'Paragraphe de présentation (optionnel)');

  // @TODO comma separated values not reliable
  const training = parseTraining(
    getChampValue(dossier.champs, 'Formations et expériences')
  );
  const adeli = getChampValue(dossier.champs, 'Numéro Adeli')
  const diploma = getChampValue(dossier.champs, 'Intitulé ou spécialité de votre master de psychologie')
  const languages = getChampValue(dossier.champs, 'Langues parlées (optionnel)');

  const psy = {
    dossierNumber,
    state,
    archived,
    lastName,
    firstNames,
    address,
    region,
    departement,
    phone,
    website,
    email,
    personalEmail,
    teleconsultation,
    description,
    training,
    adeli,
    diploma,
    languages,
  };

  return psy;
}

function parsePsychologist(apiResponse) {
  console.debug(`Parsing ${apiResponse.demarche.dossiers.nodes.length} psychologists from DS API`);

  const dossiers = apiResponse.demarche.dossiers.nodes

  if(dossiers.length > 0) {
    const psychologists = dossiers.map(dossier => {
      // console.debug("Parsing a dossier", dossier);

      return parseDossierMetadata(dossier);
    });

    return psychologists;
  } else {
    console.error('Aucun psychologiste trouvé.');

    return [];
  }
}