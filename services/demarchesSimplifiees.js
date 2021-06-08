/* eslint-disable camelcase */
const graphql = require('../utils/graphql');
const uuid = require('../utils/uuid');
const config = require('../utils/config');
const { DOSSIER_STATE } = require('../utils/dossierState');
const { default: { getAdeliInfo } } = require('../utils/adeliAPI');
const { default: { areSimilar } } = require('../utils/string');

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

const autoAcceptPsychologist = async () => {
  const list = await getAllPsychologistList(
    (cursor) => graphql.getSimplePsyInfo(cursor, DOSSIER_STATE.en_instruction),
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

const getDiplomaErrors = (psychologist) => {
  const errors = [];
  const diplomaYear = psychologist.champs.find((champ) => champ.id === 'Q2hhbXAtMTYzOTE2OQ==');
  if (!diplomaYear) {
    errors.push('Diploma year missing');
  } else {
    const year = parseInt(diplomaYear.stringValue);
    const today = new Date();
    if (!year || year >= today.getFullYear() - 3) {
      errors.push('Diploma is too recent');
    }
  }

  return errors;
};

const getAdeliErrors = (psychologist, adeliInfo) => {
  const errors = [];
  const adeliNumber = psychologist.champs.find((champ) => champ.id === 'Q2hhbXAtMTYyNjk4Nw==');
  const info = adeliNumber && adeliInfo[adeliNumber.stringValue];
  if (!info) {
    errors.push('No info found for this Adeli number');
  } else {
    if (info['Code profession'] !== 73) {
      errors.push(`Person is not a Psychologue but a ${info['Libellé profession']}`);
    }

    if (!areSimilar(info["Prénom d'exercice"], psychologist.demandeur.prenom)) {
      errors.push(`First name does not match (${info["Prénom d'exercice"]} <> ${psychologist.demandeur.prenom})`);
    }

    if (!areSimilar(info["Nom d'exercice"], psychologist.demandeur.nom)) {
      errors.push(`Last name does not match (${info["Nom d'exercice"]} <> ${psychologist.demandeur.nom})`);
    }
  }
  return errors;
};

const verifyPsychologist = (psychologist, adeliInfo) => {
  const errors = []
  .concat(getDiplomaErrors(psychologist))
  .concat(getAdeliErrors(psychologist, adeliInfo));

  if (errors.length === 0) {
    graphql.putDossierInInstruction(psychologist.id, `Dossier vérifié automatiquement le ${new Date()}`);
    return true;
  }

  graphql.addVerificationMessage(psychologist.id,
    `Le dossier n'a pas passé la vérification automatique le ${new Date()} car ${errors}`);
  return false;
};

const autoVerifyPsychologist = async () => {
  const dossiersToBeVerified = await getAllPsychologistList(
    (cursor) => graphql.getDossiersToBeVerified(cursor),
  );

  console.log(`${dossiersToBeVerified.psychologists.length} psychologists needs verification`);
  let countAutoVerify = 0;

  const adeliIds = dossiersToBeVerified.psychologists
    .map((psychologist) => psychologist.champs.find((x) => x.id === 'Q2hhbXAtMTYyNjk4Nw=='))
    .filter((adeli) => adeli)
    .map((adeli) => adeli.stringValue);
  const adeliInfo = await getAdeliInfo(adeliIds);

  dossiersToBeVerified.psychologists.forEach((psychologist) => {
    const isVerified = verifyPsychologist(psychologist, adeliInfo);
    if (isVerified) {
      countAutoVerify++;
    }
  });
  console.log(`${countAutoVerify} have been auto verified`);
};

exports.autoVerifyPsychologist = autoVerifyPsychologist;
