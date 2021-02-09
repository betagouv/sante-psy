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
 * @see https://demarches-simplifiees-graphql.netlify.app/demarche.doc.html
 */
async function requestPsychologist(academy = '') { 
  const query = gql`
    {
      demarche (number: ${config.demarchesSimplifieesId}) {
        id
        dossiers (state: en_construction) {
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
              usager {
                email
              }
          }
        }
      }
    }
  `;

  console.debug('GraphQL query sent:', query);

  try {
    const psychologists = await graphQLClient.request(query)
    console.debug(JSON.stringify(psychologists, undefined, 2))

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
  console.log('apiResponse', apiResponse);
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