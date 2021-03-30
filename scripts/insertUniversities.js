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
  "Lyon",
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
]

const runInsert = async () => {
  for (const university of universities) {
    try {
      await dbUniversities.insertUniversity(university)
      console.log('inserted', university)
    } catch (err) {
      console.error('Could not insert', university, err)
    }
  }
}

return runInsert()
