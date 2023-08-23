import path from 'path';
import config from '../../utils/config';
import { DossierState } from '../../types/DossierState';
import {
  getChampsIdFromField,
  getAnnotationsIdFromField,
} from '../champsAndAnnotations';
import importDossier from './importDossier';
import uploadDocument from './uploadDocument';
import graphql from './buildRequest';
import autoAcceptMessage from '../../utils/configDS/autoAcceptMessage';

const FILE = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'static',
  'documents',
  'parcours_psychologue_sante_psy_etudiant.pdf',
);

const sendAutoAcceptMessage = async (dossierId: string, departement: string): Promise<void> => {
  const uploadFileId = await uploadDocument(FILE, dossierId);
  const waitForConvention = config.demarchesSimplifiees.waitingForConventionDepartments.includes(departement);
  const message = autoAcceptMessage(config.contactEmail, waitForConvention);
  const result = await graphql.sendMessageWithAttachment(message, uploadFileId, dossierId);

  console.debug('message envoyé :', result);
};

const autoAcceptPsychologists = async (): Promise<void> => {
  try {
    const list = await importDossier.getAllPsychologistList(
      (cursor) => graphql.getSimplePsyInfo(cursor, DossierState.enInstruction),
    );
    console.log(`${list.psychologists.length} psychologists are in instruction`);
    let countAutoAccept = 0;
    await Promise.all(list.psychologists
      .map((psychologist) => {
        const departement = psychologist.champs
          .find((champ) => champ.id === getChampsIdFromField('departement'))
          .stringValue;
        return { psychologist, departement };
      })
      .filter(
        ({ psychologist, departement }) => {
          const isVerified = psychologist.annotations
            .find((annotation) => annotation.id === getAnnotationsIdFromField('verifiee'))
            .stringValue;
          return isVerified === 'true' && config.demarchesSimplifiees.autoAcceptDepartments.includes(departement);
        },
      )
      .map(
        async ({ psychologist, departement }) => {
          await sendAutoAcceptMessage(psychologist.id, departement);
          await graphql.acceptPsychologist(psychologist.id);
          console.debug(`Auto accept psychologist ${psychologist.id}`);
          countAutoAccept++;
        },
      ));
    console.log(`${countAutoAccept} have been auto accepted`);
  } catch (err) {
    console.error('An error occured in autoAcceptPsychologists job', err);
  }
};

export default autoAcceptPsychologists;
