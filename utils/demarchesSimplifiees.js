const graphql = require('../utils/graphql');

async function getPsychologistList() {
  const apiResponse = await graphql.requestPsychologist();

  return parsePsychologist(apiResponse);
}
  
exports.getPsychologistList = getPsychologistList;

function parsePsychologist(apiResponse) {
  console.debug("apiResponse", apiResponse.demarche.dossiers.nodes)
  const dossiers = apiResponse.demarche.dossiers.nodes

  if(dossiers.length > 0) {
    const psychologists = dossiers.map(dossier => {

      //@TODO improve me, how to get a specific attribute without using 'find'
      const name = dossier.champs.find(champ => champ.label === 'Nouveau champ Texte').stringValue;
      const address = dossier.champs.find(champ => champ.label === 'Nouveau champ Texte').stringValue;
      const phone = dossier.champs.find(champ => champ.label === 'Nouveau champ Texte').stringValue;
      
      const psy = { name, address, phone };
      
      return psy;
    });
    console.log("final parsed psychologists list", psychologists);
    return psychologists;
  } else {
    console.error('Aucun psychologist trouvé.');
    
    return [];
  }
}