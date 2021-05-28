/* eslint-disable camelcase */
const graphql = require('./graphql');
const uuid = require('./uuid');
const config = require('./config');

// @see https://demarches-simplifiees-graphql.netlify.app/dossierstate.doc.html
// eslint-disable-next-line no-unused-vars
exports.DOSSIER_STATE = {
  en_construction: 'en_construction',
  en_instruction: 'en_instruction',
  accepte: 'accepte',
  refuse: 'refuse',
  sans_suite: 'sans_suite',
};

function getChampValue(champData, attributeName, stringValue = true) {
  const potentialStringValue = champData.find((champ) => champ.label === attributeName);

  if (typeof potentialStringValue === 'undefined') {
    console.warn(`Champ from API ${attributeName} does not exist`);

    return '';
  }
  if (stringValue) {
    return potentialStringValue.stringValue.trim();
  }
  return potentialStringValue.value.trim();
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
  if (inputString.includes(',')) {
    return JSON.stringify(inputString.split(', '));
  }
  return JSON.stringify([inputString]);
}

function getUuidDossierNumber(number) {
  return uuid.generateUuidFromString(`${config.demarchesSimplifieesId}-${number}`);
}

function parseDossierMetadata(dossier) {
  const { state } = dossier;
  const { archived } = dossier;
  const lastName = dossier.demandeur.nom.trim();
  const firstNames = dossier.demandeur.prenom.trim();
  const personalEmail = dossier.usager.email.trim();
  const dossierNumber = getUuidDossierNumber(dossier.number);
  const region = dossier.groupeInstructeur.label;
  const address = getChampValue(dossier.champs, 'Adresse du cabinet');
  const departement = getChampValue(dossier.champs, 'Votre département'); // "14 - Calvados"
  const phone = getChampValue(dossier.champs, 'Téléphone du secrétariat');
  const teleconsultation = parseTeleconsultation(
    getChampValue(dossier.champs, 'Proposez-vous de la téléconsultation ?'),
  );
  const website = getChampValue(dossier.champs, 'Site web professionnel (optionnel)');
  const email = getChampValue(dossier.champs, 'Email de contact');
  const description = getChampValue(dossier.champs, 'Paragraphe de présentation (optionnel)');

  // @TODO comma separated values not reliable
  const training = parseTraining(
    getChampValue(dossier.champs, 'Formations et expériences'),
  );
  const adeli = getChampValue(dossier.champs, 'Numéro Adeli');
  const diploma = getChampValue(dossier.champs, 'Intitulé ou spécialité de votre master de psychologie');
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
  const dossiers = apiResponse.demarche.dossiers.nodes;
  console.log(`Parsing ${dossiers.length} psychologists from DS API`);

  if (dossiers.length > 0) {
    const psychologists = dossiers.map((dossier) => parseDossierMetadata(dossier));
    return psychologists;
  }

  return [];
}

/**
 * helper function called by getPsychologistList
 * @param {*} cursor
 * @param {*} accumulator
 */
async function getAllPsychologistList(cursor, accumulator = []) {
  const apiResponse = await graphql.requestPsychologist(cursor);

  const { pageInfo } = apiResponse.demarche.dossiers;

  const nextAccumulator = accumulator.concat(
    parsePsychologist(apiResponse),
  );

  if (pageInfo.hasNextPage) {
    return getAllPsychologistList(pageInfo.endCursor, nextAccumulator);
  }
  return {
    psychologists: nextAccumulator,
    lastCursor: pageInfo.endCursor,
  };
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
 * Output : "55"
 * @param {} departementString ex : '55 - Indre-et-Loire'
 */
module.exports.getDepartementNumberFromString = function getDepartementNumberFromString(departementString) {
  if (!departementString) {
    return null;
  }
  // Note : this is not robust. If Demarches Simplifiées changes their format it will break.
  const parts = departementString.split(' - ');
  return parts[0];
};
