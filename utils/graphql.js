const { gql, GraphQLClient } = require('graphql-request');
const config = require('./config');
const { default: { getChampsIdFromField, getAnnotationsIdFromField } } = require('../services/champsAndAnnotations');

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
function getWhereConditionAfterCursor(cursor) {
  if (cursor) {
    return `(after: "${cursor}")`;
  }
  return '';
}

/**
 * log errors from DS
 * @param {*} apiResponse 
 */
function logErrorsFromDS(apiResponse) {
  if (apiResponse.response) {
    if (apiResponse.response.errors.length > 0) {
      apiResponse.response.errors.forEach((err) => {
        console.error('Error details', err);
      });
    }
  }
}

const request = async (query, variables) => {
  console.debug('GraphQL query sent:', query, variables);

  try {
    return await graphQLClient.request(query, variables);
  } catch (err) {
    console.error('API has returned error', err);
    logErrorsFromDS(err);
    // eslint-disable-next-line no-throw-literal
    throw 'Error from DS API';
  }
};

const getSimplePsyInfo = (cursor, state) => {
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
              champs (id: "${getChampsIdFromField('adeli')}") {
                id
                label
                stringValue
              }
          }
        }
      }
    }
  `;

  return request(query);
};

const getInstructors = (groupeInstructeurNumber) => {
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

  return request(query, variables);
};

const acceptPsychologist = (id) => {
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
      motivation: config.demarchesSimplifieesAutoAcceptMessage,
    },
  };

  return request(query, variables);
};

const getDossiersWithAnnotationsAndMessages = (cursor, state) => {
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
  return request(query);
};

const putDossierInInstruction = (id, message) => {
  // TODO: mutation 
  console.debug(`Put dossier ${id} in instruction with message: ${message}`);
};

const addVerificationMessage = (id, message) => {
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

  return request(query, variables);
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
async function requestPsychologist(afterCursor) {
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

  return request(query);
}

exports.acceptPsychologist = acceptPsychologist;
exports.getInstructors = getInstructors;
exports.getSimplePsyInfo = getSimplePsyInfo;
exports.requestPsychologist = requestPsychologist;
exports.getDossiersWithAnnotationsAndMessages = getDossiersWithAnnotationsAndMessages;
exports.putDossierInInstruction = putDossierInInstruction;
exports.addVerificationMessage = addVerificationMessage;
