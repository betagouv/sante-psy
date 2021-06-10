/* eslint-disable camelcase */
const graphql = require('../utils/graphql');
const uuid = require('../utils/uuid');
const date = require('../utils/date');
const config = require('../utils/config');
const { DOSSIER_STATE } = require('../utils/dossierState');
const { default: { getAdeliInfo } } = require('../utils/adeliAPI');
const { default: { areSimilar } } = require('../utils/string');
const {
  default: {
    getChampsFieldFromId,
    getChampsIdFromField,
    getAnnotationsIdFromField,
  },
} = require('./champsAndAnnotations');

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
    const field = getChampsFieldFromId(champ.id);
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
          .find((champ) => champ.id === getChampsIdFromField('departement'))
          .stringValue;
        const isVerified = psychologist.annotations
          .find((annotation) => annotation.id === getAnnotationsIdFromField('verifiee'))
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
  const diplomaYearId = getChampsIdFromField('diplomaYear');
  const diplomaYear = psychologist.champs.find((champ) => champ.id === diplomaYearId);
  if (!diplomaYear) {
    errors.push('pas d\'année d\'obtention du diplôme');
  } else {
    const year = parseInt(diplomaYear.stringValue);
    const today = new Date();
    if (!year || year >= today.getFullYear() - 3) {
      errors.push('le diplôme est trop récent');
    }
  }

  return errors;
};

const getAdeliErrors = (psychologist, adeliInfo) => {
  const errors = [];
  const adeliChampId = getChampsIdFromField('adeli');
  const adeliNumber = psychologist.champs.find((champ) => champ.id === adeliChampId);
  const info = adeliNumber && adeliInfo[adeliNumber.stringValue];
  if (!info) {
    errors.push('pas de correspondance pour ce numéro Adeli');
  } else {
    if (info['Code profession'] !== 93) {
      errors.push(`la personne n'est pas un psychologue mais un ${info['Libellé profession']}`);
    }

    if (!areSimilar(info["Prénom d'exercice"], psychologist.demandeur.prenom)) {
      errors.push(`les prénoms ne matchent pas (${info["Prénom d'exercice"]} vs ${psychologist.demandeur.prenom})`);
    }

    if (!areSimilar(info["Nom d'exercice"], psychologist.demandeur.nom)) {
      errors.push(`le nom ne matche pas (${info["Nom d'exercice"]} vs ${psychologist.demandeur.nom})`);
    }
  }
  return errors;
};

const verifyPsychologist = (psychologist, adeliInfo) => {
  const today = date.toFormatDDMMYYYY(new Date());

  const errors = []
  .concat(getDiplomaErrors(psychologist))
  .concat(getAdeliErrors(psychologist, adeliInfo));

  if (errors.length === 0) {
    graphql.addVerificationMessage(psychologist.id, `Dossier vérifié automatiquement le ${today}`);
    graphql.verifyDossier(psychologist.id);
    graphql.putDossierInInstruction(psychologist.id);
    return true;
  }

  graphql.addVerificationMessage(psychologist.id,
    `Le dossier n'a pas passé la vérification automatique le ${today} car ${errors}`);
  return false;
};

const autoVerifyPsychologist = async () => {
  const dossiersInConstruction = await getAllPsychologistList(
    (cursor) => graphql.getDossiersWithAnnotationsAndMessages(cursor, DOSSIER_STATE.en_construction),
  );
  console.log(`${dossiersInConstruction.psychologists.length} psychologists are in construction`);

  const dossiersToBeVerified = dossiersInConstruction.psychologists
    .filter(
      (psychologist) => {
        const isVerified = psychologist.annotations
          .find((annotation) => annotation.id === getAnnotationsIdFromField('verifiee'))
          .stringValue === 'true';
        const hasVerificationNote = psychologist.annotations
          .find((annotation) => annotation.id === getAnnotationsIdFromField('message'))
          .stringValue !== '';
        const hasMessage = psychologist.messages.length > 1; // There is always one message (submission confirmation)
        return !isVerified && !hasVerificationNote && !hasMessage;
      },
    );
  console.log(`${dossiersToBeVerified.length} psychologists needs verification`);

  if (dossiersToBeVerified.length > 0) {
    let countAutoVerify = 0;

    const adeliChampId = getChampsIdFromField('adeli');
    const adeliIds = dossiersToBeVerified
      .map((psychologist) => psychologist.champs.find((x) => x.id === adeliChampId))
      .filter((adeli) => adeli)
      .map((adeli) => adeli.stringValue);
    const adeliInfo = await getAdeliInfo(adeliIds);

    dossiersToBeVerified.forEach((psychologist) => {
      const isVerified = verifyPsychologist(psychologist, adeliInfo);
      if (isVerified) {
        countAutoVerify++;
      }
    });
    console.log(`${countAutoVerify} have been auto verified`);
  }
};

exports.autoVerifyPsychologist = autoVerifyPsychologist;
