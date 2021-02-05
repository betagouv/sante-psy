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
async function requestPsychologist() { 
  const query = gql`
    {
      demarche (number: ${config.demarchesSimplifieesId}) {
        id
        dossiers (state: en_construction
          ) {
          nodes {
              id
              state
              champs {
                id
                label
                stringValue
              }
          }
        }
      }
    }
  `;

  console.log('GraphQL query:', query);

  const psychologists = await graphQLClient.request(query)
  console.log(JSON.stringify(psychologists, undefined, 2))

  return psychologists;
}
  
exports.requestPsychologist = requestPsychologist