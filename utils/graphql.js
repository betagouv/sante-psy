const { gql , GraphQLClient} = require('graphql-request');
const config = require('../utils/config');

const endpoint = config.apiUrl;
const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${config.apiToken}`,
    'Content-Type': 'application/json'
  },
});

/**
 * get the GraphQL where condition to get another page of information
 * @see https://demarches-simplifiees-graphql.netlify.app/pageinfo.doc.html
 * @param {*} cursor : String
 */
function wherePaginateAfter(cursor) {
  if( cursor ) {
    return `, after: "${cursor}"`;
  } else {
    return '';
  }
}

/**
 * # Arguments pour dossiers
    # after: Returns the elements in the list that come after the
    # specified cursor. (endCursor). Is a String so we should use quotes
    # order: L’ordre des dossiers.
    # createdSince: Dossiers déposés depuis la date.
    # updatedSince: Dossiers mis à jour depuis la date.
    # state: Dossiers avec statut. is not a string, we should not use quotes
    # archived: Si présent, permet de filtrer les dossiers archivés 
 * @see https://demarches-simplifiees-graphql.netlify.app/demarche.doc.html
 */
async function requestPsychologist(afterCursor) { 
  const paginationCondition = wherePaginateAfter(afterCursor);

  const query = gql`
    {
      demarche (number: ${config.demarchesSimplifieesId}) {
        id
        dossiers (state: en_construction, archived: false ${paginationCondition}) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {
              groupeInstructeur {
                label
              }
              state
              champs {
                id
                label
                stringValue
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
    if(hasErrors(err)) {
      throw 'Une erreur est survenue lors de la récupération des psychologues';
    }   
    return [];
  }
}

/**
 * @param {response} response 
 */
function hasErrors(apiResponse) {
  if(apiResponse.response.errors.length > 0) {
    apiResponse.response.errors.forEach(err => {
      console.error('API has returned error', err); // server error logs
    });

    return true;
  } else {
    return false;
  }
}

exports.requestPsychologist = requestPsychologist;