import { GraphQLClient } from 'graphql-request';
import config from './config';

const endpoint = config.apiUrl;
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${config.apiToken}`,
    'Content-Type': 'application/json',
  },
});

/**
 * log errors from DS
 * @param {*} apiResponse 
 */
const logErrorsFromDS = (apiResponse: {response: {errors: string[]}}): void => {
  if (apiResponse.response) {
    if (apiResponse.response.errors.length > 0) {
      apiResponse.response.errors.forEach((err) => {
        console.error('Error details', err);
      });
    }
  }
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const request = async (query, variables) => {
  console.debug('GraphQL query sent:', query, variables);

  try {
    const result = await graphQLClient.request(query, variables);
    console.debug('GraphQL query result:', result);
    return result;
  } catch (err) {
    console.error('API has returned error', err);
    logErrorsFromDS(err);
    // eslint-disable-next-line no-throw-literal
    throw 'Error from DS API';
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const executeQuery = (query: string, variables = undefined): Promise<any> => request(query, variables);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const executeMutation = async (query: string, variables = undefined): Promise<any> => {
  if (config.testEnvironment) {
    console.log('Mutation bypassed because you are using a test environment', query, variables);
    return Promise.resolve();
  }
  return request(query, variables);
};

export default {
  executeQuery,
  executeMutation,
};
