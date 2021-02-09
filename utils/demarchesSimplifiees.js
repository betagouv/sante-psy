const graphql = require('../utils/graphql');

async function getPsychologistList(academy) {
  const apiResponse = await graphql.requestPsychologist(academy);

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
      const address = dossier.champs.find(champ => champ.label === 'Adresse du cabinet').stringValue;
      const academy = dossier.groupeInstructeur.label.stringValue;
      const phone = dossier.champs.find(champ => champ.label === 'Nouveau champ Texte').stringValue;
      const teleconsultation = dossier.champs.find(champ => champ.label === 'Proposez-vous de la téléconsultation ?').stringValue;
      const website = dossier.champs.find(champ => champ.label === 'Site web professionnel (optionnel)').stringValue;
      const email = dossier.champs.find(champ => champ.label === 'Email de contact').stringValue;
      const training = dossier.champs.find(champ => champ.label === 'Formations et expériences').stringValue.split(', ');
      const adeliNumber = dossier.champs.find(champ => champ.label === 'Numéro Adeli').stringValue;
      const diploma = dossier.champs.find(champ => champ.label === 'Intitulé ou spécialité de votre master de psychologie').stringValue;
      const dateDiploma = dossier.champs.find(champ => champ.label === 'Date d\'obtention de votre master').stringValue;
      const profileDescription = dossier.champs.find(champ => champ.label === 'Paragraphe de présentation (optionnel)').stringValue;
      
      const psy = { name, address, phone };
      
      return psy;
    });
    console.log("final parsed psychologists list", psychologists);
    return psychologists;
  } else {
    console.error('Aucun psychologiste trouvé.');

    return [];
  }
}