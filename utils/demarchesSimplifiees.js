const graphql = require('../utils/graphql');

async function getPsychologistList(input) {
  return graphql.requestPsychologist();
}
  
exports.getPsychologistList = getPsychologistList;