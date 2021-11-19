import getDiplomaErrors from '../getDiplomaErrors';
import getAdeliErrors from '../getAdeliErrors';
import { DSPsychologist } from '../../types/Psychologist';
import { AdeliInfo } from '../../types/AdeliInfo';
import graphql from './buildRequest';
import date from '../../utils/date';

const verifyPsychologist = async (psychologist: DSPsychologist, adeliInfo:{[key: string]: AdeliInfo})
  : Promise<boolean> => {
  const today = date.toFormatDDMMYYYY(new Date());

  const errors = []
    .concat(getDiplomaErrors(psychologist))
    .concat(getAdeliErrors(psychologist, adeliInfo));

  if (errors.length === 0) {
    const verificationMessage = graphql.addVerificationMessage(
      psychologist.id,
      `Dossier vérifié automatiquement le ${today}`,
    );
    const verifyDossier = graphql.verifyDossier(psychologist.id);
    const putDossierInInstruction = graphql.putDossierInInstruction(psychologist.id);
    await Promise.all([verificationMessage, verifyDossier, putDossierInInstruction]);
    return true;
  }

  await graphql.addVerificationMessage(
    psychologist.id,
    `Le dossier n'a pas passé la vérification automatique le ${today} car ${errors}`,
  );
  return false;
};

export default verifyPsychologist;
