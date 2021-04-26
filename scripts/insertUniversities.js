const dbUniversities = require('../db/universities')

const universities = [
  "--- Aucune pour le moment",
  "Strasbourg (UNISTRA)",
  "Poitiers",
  "La Rochelle",
  "Savoie Mont-Blanc",
  "Cergy Paris Université",
  "Haute-Alsace (UHA)",
  "Rennes",
  "Clermont-Auvergne (UCA)",
  "Picardie Jules Verne",
  "Toulouse Midi-Pyrénées",
  "Reims Champagne-Ardenne",
  "Lille",
  "Limoges",
  "La Sorbonne",
  "Bordeaux",
  "Pau et Pays de l'Adour (UPPA)",
  "Dijon",
  "Le Mans Université",
  "Versailles Saint-Quentin (UVSQ)",
  "Franche-Comté",
  "Angers",
  "Lyon 1",
  "Lyon 2",
  "Lyon 3",
  "Montpellier",
  "Montpellier 3",
  "Perpignan (UPVD)",
  "Corsica Pasquale Paoli",
  "Caen Normandie",
  "Grenoble Alpes",
  "Le Havre Normandie",
  "Rouen",
  "Lorraine Sud-Nancy",
  "Sorbonne Paris Nord",
  "Saint-Etienne - Jean Monnet",
  "Paris Saclay",
  "Bretagne Occidentale",
  "Paris Est Créteil (UPEC)",
  "Evry",
  "Tours",
  "Paris Descartes (Université de Paris)",
  "La Réunion",
  "Bretagne Sud",
  "Nantes",
  "Toulon",
  "Côte d'Azur",
  "Orléans",
  "Aix-Marseille",
  "Paris Est Marne-la-Vallée (UPEM)",
  "Nîmes",
  "Antilles - Pôle Martinique",
  "Antilles - Pôle Guadeloupe",
  "Avignon",
]

const runInsert = async () => {
  const universitiesSavedInDB = await dbUniversities.getUniversities()

  if(universitiesSavedInDB.length === 0) { // to avoid duplicates
    for (const university of universities) {
      try {
        await dbUniversities.insertUniversity(university)
        console.log('inserted', university)
      } catch (err) {
        console.error('Could not insert', university, err)
      }
    }
  } else {
    console.log('Universities have already been inserted - you need to do this manually \
if you want to update the universities list')
  }

  // eslint-disable-next-line no-process-exit
  process.exit(1);
}

return runInsert()
