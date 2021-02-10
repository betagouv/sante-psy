const graphql = require('../utils/graphql');

async function getPsychologistList(academy) {
  const apiResponse = await graphql.requestPsychologist(academy);

  return parsePsychologist(apiResponse);
}
  
exports.getPsychologistList = getPsychologistList;

function getName(demandeur) {
  return demandeur.prenom + ' ' + demandeur.nom;
}

function getChampValue(champData, attributeName) {
  return champData.find(champ => champ.label === attributeName).stringValue;
}

/**
 * transform string to boolean
 * @param {*} inputString 'true' or 'false' 
 */
function parseTeleconsultation(inputString) {
  return inputString === 'true';
}

function parsePsychologist(apiResponse) {
  console.debug(`Parsing ${apiResponse.demarche.dossiers.nodes.length} psychologists from DS API`);
  
  const dossiers = apiResponse.demarche.dossiers.nodes

  if(dossiers.length > 0) {
    const psychologists = dossiers.map(dossier => {
      const name = getName(dossier.demandeur);
      const university = dossier.groupeInstructeur.label.stringValue;
      const address = getChampValue(dossier.champs, 'Adresse du cabinet');
      const phone =  getChampValue(dossier.champs, 'Téléphone du secrétariat');
      const teleconsultation = parseTeleconsultation(
        getChampValue(dossier.champs, 'Proposez-vous de la téléconsultation ?')
      );
      const website =  getChampValue(dossier.champs, 'Site web professionnel (optionnel)');
      const email =  getChampValue(dossier.champs, 'Email de contact');
      const description =  getChampValue(dossier.champs, 'Paragraphe de présentation (optionnel)');


      //@TODO remove unused variables ?
      const training =  getChampValue(dossier.champs, 'Formations et expériences').split(', ');
      const adeliNumber =  getChampValue(dossier.champs, 'Numéro Adeli');
      const diploma =  getChampValue(dossier.champs, 'Intitulé ou spécialité de votre master de psychologie');
      const dateDiploma =  getChampValue(dossier.champs, 'Date d\'obtention de votre master');
      
      const psy = { 
        name,
        address,
        phone,
        website,
        email,
        teleconsultation,
        description
      };
      
      return psy;
    });

    return psychologists;
  } else {
    console.error('Aucun psychologiste trouvé.');

    return [];
  }
}