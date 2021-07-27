import graphql from '../../utils/graphql';
import uuid from '../../utils/uuid';
import config from '../../utils/config';
import { getChampsFieldFromId } from '../champsAndAnnotations';
import { Psychologist } from '../../types/Psychologist';

const parseTeleconsultation = (inputString: string): boolean => inputString === 'true';

/**
 * transform string "speciality1, speciality2" to array ["speciality1", "speciality2"]
 * as a JSON to store it inside PG
 */
const parseTraining = (inputString: string): string => {
  if (inputString.includes(',')) {
    return JSON.stringify(inputString.split(', '));
  }
  return JSON.stringify([inputString]);
};

const getUuidDossierNumber = (number: number): string => (
  uuid.generateFromString(`${config.demarchesSimplifieesId}-${number}`)
);

const parseDossierMetadata = (dossier: any): Psychologist => {
  const {
    state, archived, demandeur, usager, number, groupeInstructeur, champs,
  } = dossier;
  const psy: any = { state, archived };

  psy.dossierNumber = getUuidDossierNumber(number);

  psy.lastName = demandeur.nom.trim();
  psy.firstNames = demandeur.prenom.trim();

  psy.personalEmail = usager.email.trim();

  psy.region = groupeInstructeur.label;

  const champsToMap = [
    'departement',
    'diploma',
    'adeli',
    'phone',
    'address',
    'email',
    'languages',
    'website',
    'description',
    'teleconsultation',
    'training',
  ];
  champs.forEach((champ) => {
    const field = getChampsFieldFromId(champ.id);
    if (champsToMap.includes(field)) {
      psy[field] = champ.stringValue.trim();
    }
  });
  psy.teleconsultation = parseTeleconsultation(psy.teleconsultation);
  psy.training = parseTraining(psy.training);

  return psy;
};

const parsePsychologists = (psychologists: any[]): Psychologist[] => {
  console.log(`Parsing ${psychologists.length} psychologists from DS API`);

  return psychologists.map((psychologist) => parseDossierMetadata(psychologist));
};

/**
 * helper function called by getPsychologistList
 * @param {*} cursor
 * @param {*} accumulator
 */
const getAllPsychologistList = async (graphqlFunction, cursor = undefined, accumulator = []) => {
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
};

/**
 * get all psychologist from DS API
 *
 * DS API return 100 elements maximum
 * if we have more than 100 elements in DS, we have to use pagination (cursor)
 * cursor : String - next page to query the API
 */
const getPsychologistList = async (cursor) => {
  const time = `Fetching all psychologists from DS (query id #${Math.random().toString()})`;

  console.time(time);
  const list = await getAllPsychologistList(graphql.requestPsychologist, cursor);
  list.psychologists = parsePsychologists(list.psychologists);
  console.timeEnd(time);

  return list;
};

export default {
  getPsychologistList,
  getAllPsychologistList,
};
