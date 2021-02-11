const graphql = require('../utils/graphql');
const _ = require('lodash');

async function getPsychologistList(academy) {
  const apiResponse = await graphql.requestPsychologist(academy);

  return parsePsychologist(apiResponse);
}
  
exports.getPsychologistList = getPsychologistList;

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