const graphql = require('../../utils/graphql');
const date = require('../../utils/date');
const { DOSSIER_STATE } = require('../../utils/dossierState');
const { default: { getAdeliInfo } } = require('../../utils/adeliAPI');
const { default: { areSimilar } } = require('../../utils/string');
const {
  default: {
    getChampsIdFromField,
    getAnnotationsIdFromField,
  },
} = require('../champsAndAnnotations');
const { getAllPsychologistList } = require('./demarchesSimplifiees');

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
