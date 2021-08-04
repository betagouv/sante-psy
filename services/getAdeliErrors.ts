import string from '../utils/string';
import { getChampsIdFromField } from './champsAndAnnotations';
import { DSPsychologist } from '../types/Psychologist';
import { AdeliInfo } from '../types/AdeliInfo';

const getAdeliErrors = (psychologist: DSPsychologist, adeliInfo: {[key: string]: AdeliInfo}): string[] => {
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

export default getAdeliErrors;
