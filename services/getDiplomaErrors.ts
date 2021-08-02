import { getChampsIdFromField } from './champsAndAnnotations';
import { DSPsychologist } from '../types/Psychologist';

const getDiplomaErrors = (psychologist: DSPsychologist): string[] => {
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

export default getDiplomaErrors;
