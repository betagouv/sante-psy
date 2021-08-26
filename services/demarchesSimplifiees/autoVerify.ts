import { DossierState } from '../../types/DossierState';
import { getAdeliInfo } from '../../utils/adeliAPI';
import {
  getChampsIdFromField,
  getAnnotationsIdFromField,
} from '../champsAndAnnotations';
import importDossier from './importDossier';
import verifyPsychologist from './verifyPsychologist';
import graphql from './buildRequest';

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
