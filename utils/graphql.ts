import { gql, GraphQLClient } from 'graphql-request';
import config from './config';
import { getChampsIdFromField, getAnnotationsIdFromField } from '../services/champsAndAnnotations';
import { DSResponse, FileInfo, GroupeInstructeur } from '../types/DemarcheSimplifiee';
import { DossierState } from '../types/DossierState';

const endpoint = config.apiUrl;
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${config.apiToken}`,
    'Content-Type': 'application/json',
  },
});

/**
 * get the GraphQL where condition to get another page of information
 * @see https://demarches-simplifiees-graphql.netlify.app/pageinfo.doc.html
 * @param {*} cursor : String
 */
const getWhereConditionAfterCursor = (cursor: string): string => {
  if (cursor) {
    return `(after: "${cursor}")`;
  }
  return '';
};

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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const executeQuery = (query, variables = undefined) => request(query, variables);
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const executeMutation = async (query, variables = undefined) => {
  if (config.testEnvironment) {
    console.log('Mutation bypassed because you are using a test environment', query, variables);
    return Promise.resolve();
  }
  return request(query, variables);
};

const getSimplePsyInfo = (cursor: string, state: DossierState): Promise<DSResponse> => {
  const query = gql`
    {
      demarche (number: ${config.demarchesSimplifieesId}) {
        dossiers (state: ${state}${cursor ? `, after: "${cursor}"` : ''}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
              id
              state
              datePassageEnInstruction
              annotations(id: "${getAnnotationsIdFromField('verifiee')}") {
                id
                label
                stringValue
              }
              champs (id: "${getChampsIdFromField('departement')}") {
                id
                label
                stringValue
              }
          }
        }
      }
    }
  `;

  return executeQuery(query);
};

const getInstructors = (groupeInstructeurNumber: string): Promise<GroupeInstructeur> => {
  const query = gql`
    query getGroupeInstructeur($groupeInstructeurNumber: Int!) {
      groupeInstructeur(number: $groupeInstructeurNumber) {
        id
        number
        label
        instructeurs {
          id
          email
        }
      }
    }
  `;

  const variables = {
    groupeInstructeurNumber,
  };

  return executeQuery(query, variables);
};

const acceptPsychologist = (id: string): Promise<{errors: {message: string}}[]> => {
  const query = gql`
    mutation dossierAccepter($input: DossierAccepterInput!) {
      dossierAccepter(input: $input) {
        errors {
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      dossierId: id,
      instructeurId: config.demarchesSimplifieesInstructor,
    },
  };

  return executeMutation(query, variables);
};

const getDossiersWithAnnotationsAndMessages = (cursor: string, state: DossierState): Promise<DSResponse> => {
  const query = gql`
  {
    demarche (number: ${config.demarchesSimplifieesId}) {
      dossiers (state: ${state}${cursor ? `, after: "${cursor}"` : ''}) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          champs {
            id
            label
            stringValue
          }
          annotations {
            id
            label
            stringValue
          }
          messages {
            id
          }
          demandeur {
            ... on PersonnePhysique {
              nom
              prenom
            }
          }
        }
      }
    }
  }
`;
  return executeQuery(query);
};

const addVerificationMessage = (id: string, message: string): Promise<{errors: {message: string}}[]> => {
  const query = gql`
    mutation dossierModifierAnnotationText($input: DossierModifierAnnotationTextInput!) {
      dossierModifierAnnotationText(input: $input) {
        errors {
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      dossierId: id,
      instructeurId: config.demarchesSimplifieesInstructor,
      annotationId: getAnnotationsIdFromField('message'),
      value: message,
    },
  };

  return executeMutation(query, variables);
};

const verifyDossier = (id: string): Promise<{errors: {message: string}}[]> => {
  const query = gql`
    mutation dossierModifierAnnotationCheckbox($input: DossierModifierAnnotationCheckboxInput!) {
      dossierModifierAnnotationCheckbox(input: $input) {
        errors {
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      dossierId: id,
      instructeurId: config.demarchesSimplifieesInstructor,
      annotationId: getAnnotationsIdFromField('verifiee'),
      value: true,
    },
  };

  return executeMutation(query, variables);
};

const putDossierInInstruction = (id: string): Promise<{errors: {message: string}}[]> => {
  const query = gql`
    mutation dossierPasserEnInstruction($input: DossierPasserEnInstructionInput!) {
      dossierPasserEnInstruction(input: $input) {
        errors {
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      dossierId: id,
      instructeurId: config.demarchesSimplifieesInstructor,
    },
  };

  return executeMutation(query, variables);
};

/**
 * # Arguments pour dossiers
    # after: Returns the elements in the list that come after the
    # specified cursor. (endCursor). est un String, utilisez les guillemets
    # order: L’ordre des dossiers.
    # createdSince: Dossiers déposés depuis la date.
    # updatedSince: Dossiers mis à jour depuis la date.
    # state: Dossiers avec statut. n'est pas un String, ne pas utilez de guillemets
    # archived: Si présent, permet de filtrer les dossiers archivés 
     
    mandatory field "usager.email" is used as the login email
 * @see https://demarches-simplifiees-graphql.netlify.app/demarche.doc.html
 */
const requestPsychologist = async (afterCursor: string | undefined): Promise<DSResponse> => {
  const paginationCondition = getWhereConditionAfterCursor(afterCursor);
  const query = gql`
    {
      demarche (number: ${config.demarchesSimplifieesId}) {
        id
        dossiers ${paginationCondition} {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
              archived
              number
              groupeInstructeur {
                label
              }
              state
              champs {
                id
                label
                stringValue
              }
              usager {
                email
              }
              demandeur {
                ... on PersonnePhysique {
                  civilite
                  nom
                  prenom
                }
              }
          }
        }
      }
    }
  `;

  return executeQuery(query);
};

const createDirectUpload = (fileInfo: FileInfo, dossierId: string)
: Promise<{
  createDirectUpload:{
    directUpload: {url: string, headers: string, signedBlobId: string}
  }}> => {
  // eslint-disable-next-line max-len
  const mutation = `mutation createDirectUpload($dossierId: ID!, $filename: String!, $byteSize: Int!, $checksum: String!, $contentType: String!) {
    createDirectUpload(input: {
      dossierId: $dossierId,
      filename: $filename,
      byteSize: $byteSize,
      checksum: $checksum,
      contentType: $contentType
    }) {
      directUpload {
        url
        headers
        signedBlobId
      }
    }
  }`;

  const variables = {
    dossierId,
    ...fileInfo,
  };

  return executeMutation(mutation, variables);
};

const sendMessageWithAttachment = (message: string, attachment: string, dossierId: string)
  : Promise<{errors: {message: string}}[]> => {
  // eslint-disable-next-line max-len
  const mutation = `mutation dossierEnvoyerMessage($dossierId: ID!, $instructeurId: ID!, $body: String!, $attachment: ID) {
    dossierEnvoyerMessage(input: {
      dossierId: $dossierId,
      instructeurId: $instructeurId,
      body: $body,
      attachment: $attachment
    }) {
      errors {
        message
      }
    }
  }`;

  const variables = {
    dossierId,
    instructeurId: config.demarchesSimplifieesInstructor,
    body: message,
    attachment,
  };

  return executeMutation(mutation, variables);
};

export default {
  acceptPsychologist,
  getInstructors,
  getSimplePsyInfo,
  requestPsychologist,
  getDossiersWithAnnotationsAndMessages,
  addVerificationMessage,
  verifyDossier,
  putDossierInInstruction,
  createDirectUpload,
  sendMessageWithAttachment,
};
