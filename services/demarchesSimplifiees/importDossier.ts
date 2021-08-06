import graphql from './buildRequest';
import parsePsychologists from './parsePsychologists';
import { DSPsychologist, Psychologist } from '../../types/Psychologist';
import { DSResponse } from '../../types/DemarcheSimplifiee';

/**
 * helper function called by getPsychologistList
 * @param {*} cursor
 * @param {*} accumulator
 */
const getAllPsychologistList = async (
  graphqlFunction: (string) => Promise<DSResponse>,
  cursor: string | undefined = undefined,
  accumulator: DSPsychologist[] = [],
): Promise<{
  psychologists: DSPsychologist[],
  lastCursor: string,
}> => {
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
const getPsychologistList = async (cursor: string | undefined): Promise<{
  psychologists: Psychologist[],
  lastCursor: string,
}> => {
  const time = `Fetching all psychologists from DS (query id #${Math.random().toString()})`;

  console.time(time);
  const list = await getAllPsychologistList(graphql.requestPsychologist, cursor);
  const results = {
    psychologists: parsePsychologists(list.psychologists),
    lastCursor: list.lastCursor,
  };
  console.timeEnd(time);

  return results;
};

export default {
  getPsychologistList,
  getAllPsychologistList,
};
