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

function getChampValue(champData, attributeName) {
  const potentialStringValue = champData.find((champ) => champ.label === attributeName);

  if (typeof potentialStringValue === 'undefined') {
    console.warn(`Champ from API ${attributeName} does not exist`);
    return '';
  }

  return potentialStringValue.stringValue.trim();
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
  const { state, archived } = dossier;
  const psy = { state, archived };

  psy.lastName = dossier.demandeur.nom.trim();
  psy.firstNames = dossier.demandeur.prenom.trim();
  psy.personalEmail = dossier.usager.email.trim();

  psy.dossierNumber = getUuidDossierNumber(dossier.number);
  psy.region = dossier.groupeInstructeur.label;

  psy.address = getChampValue(dossier.champs, 'Adresse du cabinet');
  psy.departement = getChampValue(dossier.champs, 'Votre département'); // "14 - Calvados"
  psy.phone = getChampValue(dossier.champs, 'Téléphone du secrétariat');
  psy.teleconsultation = parseTeleconsultation(
    getChampValue(dossier.champs, 'Proposez-vous de la téléconsultation ?'),
  );
  psy.website = getChampValue(dossier.champs, 'Site web professionnel (optionnel)');
  psy.email = getChampValue(dossier.champs, 'Email de contact');
  psy.description = getChampValue(dossier.champs, 'Paragraphe de présentation (optionnel)');

  // @TODO comma separated values not reliable
  psy.training = parseTraining(
    getChampValue(dossier.champs, 'Formations et expériences'),
  );
  psy.adeli = getChampValue(dossier.champs, 'Numéro Adeli');
  psy.diploma = getChampValue(dossier.champs, 'Intitulé ou spécialité de votre master de psychologie');
  psy.languages = getChampValue(dossier.champs, 'Langues parlées (optionnel)');

  return psy;
}

function parsePsychologists(psychologists) {
  console.log(`Parsing ${psychologists.length} psychologists from DS API`);

  return psychologists.map((psychologist) => parseDossierMetadata(psychologist));
}

/**
 * helper function called by getPsychologistList
 * @param {*} cursor
 * @param {*} accumulator
 */
async function getAllPsychologistList(graphqlFunction, cursor, accumulator = []) {
  const apiResponse = await graphqlFunction(cursor);

  const { pageInfo, nodes } = apiResponse.demarche.dossiers;

  const nextAccumulator = accumulator.concat(nodes);

  if (pageInfo.hasNextPage) {
    return getAllPsychologistList(graphqlFunction, pageInfo.endCursor, nextAccumulator);
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
  const list = await getAllPsychologistList(graphql.requestPsychologist, cursor);
  list.psychologists = parsePsychologists(list.psychologists);
  console.timeEnd(time);

  return list;
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

const autoAcceptPsychologist = async () => {
  const list = await getAllPsychologistList(
    (cursor) => graphql.getSimplePsyInfo(cursor, this.DOSSIER_STATE.en_instruction),
  );
  console.log(`${list.psychologists.length} psychologists are in instruction`);
  let countAutoAccept = 0;
  list.psychologists
    .filter(
      (psychologist) => {
        const departement = psychologist.champs
          .find((champ) => champ.id === config.demarchesSimplifieesChampDepartment)
          .stringValue;
        const isVerified = psychologist.annotations
          .find((annotation) => annotation.id === config.demarchesSimplifieesAnnotationVerifiee)
          .stringValue;
        return isVerified === 'true' && config.demarchesSimplifieesAutoAcceptDepartments.includes(departement);
      },
    )
    .forEach(
      (psychologist) => {
        graphql.acceptPsychologist(psychologist.id);
        console.debug(`Auto accept psychologist ${psychologist.id}`);
        countAutoAccept++;
      },
    );
  console.log(`${countAutoAccept} have been auto accepted`);
};

exports.autoAcceptPsychologist = autoAcceptPsychologist;

const verifyPsychologist = (psychologist) => {
  const success = false;
  const reason = 'Work in progress';

  // TODO: check diploma date
  // TODO: call api sante to check adeli number

  if (success) {
    graphql.putDossierInInstruction(psychologist.id, `Dossier vérifié automatiquement le ${new Date()}`);
    return true;
  }

  graphql.addVerificationMessage(psychologist.id,
    `Le dossier n'a pas passé la vérification automatique le ${new Date()} car ${reason}`);
  return false;
};

const autoVerifyPsychologist = async () => {
  const dossiersToBeVerified = await getAllPsychologistList(
    (cursor) => graphql.getDossiersToBeVerified(cursor),
  );
  console.log(`${dossiersToBeVerified.psychologist.length} psychologists needs verification`);
  let countAutoVerify = 0;
  dossiersToBeVerified.psychologists.forEach((psychologist) => {
    const isVerified = verifyPsychologist(psychologist);
    if (isVerified) {
      countAutoVerify++;
    }
  });
  console.log(`${countAutoVerify} have been auto verified`);
};

exports.autoVerifyPsychologist = autoVerifyPsychologist;
