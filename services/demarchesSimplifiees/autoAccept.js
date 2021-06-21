const path = require('path');
const graphql = require('../../utils/graphql');
const config = require('../../utils/config');
const { DOSSIER_STATE } = require('../../utils/dossierState');
const {
  default: {
    getChampsIdFromField,
    getAnnotationsIdFromField,
  },
} = require('../champsAndAnnotations');
const { getAllPsychologistList } = require('./importDossier');
const { default: uploadDocument } = require('./uploadDocument');

const FILE = path.join(__dirname, '..', '..', 'static', 'documents', 'parcours_psychologue_sante_psy_etudiant.pdf');

const sendAutoAcceptMessage = async (dossierId) => {
  const uploadFileId = await uploadDocument(FILE, dossierId);
  const { dossierEnvoyerMessage } = await graphql
    .sendMessageWithAttachment(config.demarchesSimplifieesAutoAcceptMessage, uploadFileId, dossierId);

  console.log('message envoyé :', dossierEnvoyerMessage);
};

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
        sendAutoAcceptMessage(psychologist.id);
        console.debug(`Auto accept psychologist ${psychologist.id}`);
        countAutoAccept++;
      },
    );
  console.log(`${countAutoAccept} have been auto accepted`);
};

exports.autoAcceptPsychologist = autoAcceptPsychologist;
