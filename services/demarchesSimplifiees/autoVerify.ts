import date from '../../utils/date';
import { DossierState } from '../../types/DemarcheSimplifiee';
import { getAdeliInfo } from '../../utils/adeliAPI';
import string from '../../utils/string';
import {
  getChampsIdFromField,
  getAnnotationsIdFromField,
} from '../champsAndAnnotations';
import importDossier from './importDossier';

const graphql = require('../../utils/graphql');

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

    if (!string.areSimilar(info["Prénom d'exercice"], psychologist.demandeur.prenom)) {
      errors.push(`les prénoms ne matchent pas (${info["Prénom d'exercice"]} vs ${psychologist.demandeur.prenom})`);
    }

    if (!string.areSimilar(info["Nom d'exercice"], psychologist.demandeur.nom)) {
      errors.push(`le nom ne matche pas (${info["Nom d'exercice"]} vs ${psychologist.demandeur.nom})`);
    }
  }
  return errors;
};

const verifyPsychologist = async (psychologist, adeliInfo) => {
  const today = date.toFormatDDMMYYYY(new Date());

  const errors = []
  .concat(getDiplomaErrors(psychologist))
  .concat(getAdeliErrors(psychologist, adeliInfo));

  if (errors.length === 0) {
    const verificationMessage = graphql.addVerificationMessage(
      psychologist.id, `Dossier vérifié automatiquement le ${today}`,
    );
    const verifyDossier = graphql.verifyDossier(psychologist.id);
    const putDossierInInstruction = graphql.putDossierInInstruction(psychologist.id);
    await Promise.all([verificationMessage, verifyDossier, putDossierInInstruction]);
    return true;
  }

  await graphql.addVerificationMessage(psychologist.id,
    `Le dossier n'a pas passé la vérification automatique le ${today} car ${errors}`);
  return false;
};

const autoVerifyPsychologists = async () : Promise<void> => {
  try {
    const dossiersInConstruction = await importDossier.getAllPsychologistList(
      (cursor) => graphql.getDossiersWithAnnotationsAndMessages(cursor, DossierState.enConstruction),
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

      await Promise.all(dossiersToBeVerified.map(async (psychologist) => {
        const isVerified = await verifyPsychologist(psychologist, adeliInfo);
        if (isVerified) {
          countAutoVerify++;
        }
      }));

      console.log(`${countAutoVerify} have been auto verified`);
    }
  } catch (err) {
    console.error('An error occured in autoVerifyPsychologists job', err);
  }
};

export default autoVerifyPsychologists;
