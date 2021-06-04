const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);
const date = require('../utils/date');
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');
const departementToUniversityName = require('../scripts/departementToUniversityName');

const universitiesTable = 'universities';
module.exports.universitiesTable = universitiesTable;

module.exports.universities = [
  '--- Aucune pour le moment',
  'Strasbourg (UNISTRA)',
  'Poitiers',
  'La Rochelle',
  'Savoie Mont-Blanc',
  'Cergy Paris Université',
  'Haute-Alsace (UHA)',
  'Rennes',
  'Clermont-Auvergne (UCA)',
  'Picardie Jules Verne',
  'Toulouse Midi-Pyrénées',
  'Reims Champagne-Ardenne',
  'Lille',
  'Limoges',
  'La Sorbonne',
  'Bordeaux',
  "Pau et Pays de l'Adour (UPPA)",
  'Dijon',
  'Le Mans Université',
  'Versailles Saint-Quentin (UVSQ)',
  'Franche-Comté',
  'Angers',
  'Lyon 1',
  'Lyon 2',
  'Lyon 3',
  'Montpellier',
  'Montpellier 3',
  'Perpignan (UPVD)',
  'Corsica Pasquale Paoli',
  'Caen Normandie',
  'Grenoble Alpes',
  'Le Havre Normandie',
  'Rouen',
  'Lorraine Sud-Nancy',
  'Sorbonne Paris Nord',
  'Saint-Etienne - Jean Monnet',
  'Paris Saclay',
  'Bretagne Occidentale',
  'Paris Est Créteil (UPEC)',
  'Evry',
  'Tours',
  'Paris Descartes (Université de Paris)',
  'La Réunion',
  'Bretagne Sud',
  'Nantes',
  'Toulon',
  "Côte d'Azur",
  'Orléans',
  'Aix-Marseille',
  'Paris Est Marne-la-Vallée (UPEM)',
  'Nîmes',
  'Antilles - Pôle Martinique',
  'Antilles - Pôle Guadeloupe',
  'Avignon',
  'Valenciennes',
];

module.exports.saveUniversities = async function saveUniversities(universitiesList) {
  console.log(`UPSERT of ${universitiesList.length} universties....`);
  const updatedAt = date.getDateNowPG(); // use to perform UPSERT in PG

  const upsertArray = universitiesList.map((university) => {
    const upsertingKey = 'id';

    try {
      return knex(universitiesTable)
      .insert(university)
      .onConflict(upsertingKey)
      .merge({ // update every field and add updatedAt
        name: university.name,
        emailSSU: university.emailSSU,
        emailUniversity: university.emailUniversity,
        updatedAt,
      });
    } catch (err) {
      console.error(`Error to insert ${university}`, err);
      return Promise.resolve();
    }
  });

  const query = await Promise.all(upsertArray);

  console.log('UPSERT universties done');

  return query;
};

module.exports.getUniversities = async () => {
  try {
    return knex.select('id', 'name', 'emailSSU', 'emailUniversity')
        .from(universitiesTable)
        .orderBy('name');
  } catch (err) {
    console.error('Impossible de récupérer les universités', err);
    throw new Error('Impossible de récupérer les universités');
  }
};

module.exports.insertUniversity = async (name) => {
  try {
    const universityArray = await knex(module.exports.universitiesTable).insert({
      name,
    }).returning('*');
    return universityArray[0];
  } catch (err) {
    console.error("Erreur de sauvegarde de l'université", err);
    throw new Error("Erreur de sauvegarde de l'université");
  }
};

/**
 * inspired from scripts/matchPsychologistsToUniversities
 * @param {*} psychologist 
 * @param {*} universities 
 */
module.exports.getAssignedUniversityId = (psychologist, universities) => {
  if (psychologist.assignedUniversityId) {
    return psychologist.assignedUniversityId;
  }
  const departement = demarchesSimplifiees.getDepartementNumberFromString(psychologist.departement);

  if (!departement) {
    console.log(`No departement found - psy id ${psychologist.dossierNumber}`);

    return null;
  }

  const correspondingUniName = departementToUniversityName[departement];
  if (!correspondingUniName) {
    console.log(`No corresponding uni name found for - departement ${departement}`);

    return null;
  }
  return module.exports.getUniversityId(universities, correspondingUniName);
};

module.exports.getUniversityId = function getUniversityId(universities, name) {
  const foundUni = universities.find((uni) => uni.name.toString().trim() === name.toString().trim());

  if (foundUni) {
    return foundUni.id;
  }
  return undefined;
};

module.exports.getUniversityName = function getUniversityName(universities, id) {
  const foundUni = universities.find((uni) => uni.id === id);

  if (foundUni) {
    return foundUni.name;
  }
  return undefined;
};

/**
 * need to have a comma separed list for nodemailer
 */
module.exports.getEmailsTo = function getEmailsTo(university) {
  if (university.emailUniversity) {
    return university.emailUniversity.split(' ; ').join(',');
  }
  return university.emailSSU ? university.emailSSU.split(' ; ').join(',') : undefined;
};
