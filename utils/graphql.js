// En général dans les utils, j'essaye de faire des trucs agnostics du métier et qui pourrait se réutiliser dans d'autres projets. 
// C'est mon opinion.
// Ici on fait clairement du GraphQL lié à l'api démarche simplifié, ce n'est pas signifié dans le nom du fichier.
// C'est du coup ambigu avec le fichier demarchesSimplifiees.js
// Alternative : Vous pourriez faire un fichier graphQL démarche simplifié agnostic de la démarche
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
function getWhereConditionAfterCursor(cursor) {
  if( cursor ) {
    return `(after: "${cursor}")`;
  } else {
    return '';
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