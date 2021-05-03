const { gql, GraphQLClient } = require('graphql-request');
const config = require('./config');

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

  console.debug('GraphQL query sent:', query);

  try {
    const psychologists = await graphQLClient.request(query);

    return psychologists;
  } catch (err) {
    console.error('API has returned error', err);
    logErrorsFromDS(err);
    // eslint-disable-next-line no-throw-literal
    throw 'Error from DS API';
  }
}

exports.requestPsychologist = requestPsychologist;
