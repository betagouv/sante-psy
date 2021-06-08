/* eslint-disable camelcase */
const graphql = require('../utils/graphql');
const uuid = require('../utils/uuid');
const config = require('../utils/config');
const { DOSSIER_STATE } = require('../utils/dossierState');
const { default: { getAdeliInfo } } = require('../utils/adeliAPI');
const { default: { areSimilar } } = require('../utils/string');
const { default: { getFieldFromId, getIdFromField } } = require('./champs');

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
  const {
    state, archived, demandeur, usager, number, groupeInstructeur, champs,
  } = dossier;
  const psy = { state, archived };

  psy.dossierNumber = getUuidDossierNumber(number);

  psy.lastName = demandeur.nom.trim();
  psy.firstNames = demandeur.prenom.trim();

  psy.personalEmail = usager.email.trim();

  psy.region = groupeInstructeur.label;

  champs.forEach((champ) => {
    const field = getFieldFromId(champ.id);
    if (field) {
      psy[field] = champ.stringValue.trim();
    }
  });
  psy.teleconsultation = parseTeleconsultation(psy.teleconsultation);
  psy.training = parseTraining(psy.training);

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
  const diplomaYearId = getIdFromField('diplomaYear');
  const diplomaYear = psychologist.champs.find((champ) => champ.id === diplomaYearId);
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
  const adeliChampId = getIdFromField('adeli');
  const adeliNumber = psychologist.champs.find((champ) => champ.id === adeliChampId);
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

  const adeliChampId = getIdFromField('adeli');
  const adeliIds = dossiersToBeVerified.psychologists
    .map((psychologist) => psychologist.champs.find((x) => x.id === adeliChampId))
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
