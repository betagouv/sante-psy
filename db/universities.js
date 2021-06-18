const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);
const date = require('../utils/date');
const departementToUniversityName = require('../scripts/departementToUniversityName');
const { universitiesTable } = require('./tables');
const { getDepartementNumberFromString } = require('../utils/department');

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
    const universityArray = await knex(universitiesTable).insert({
      name,
    }).returning('*');
    return universityArray[0];
  } catch (err) {
    console.error("Erreur de sauvegarde de l'université", err);
    throw new Error("Erreur de sauvegarde de l'université");
  }
};

module.exports.getAssignedUniversityId = (psychologist, universities) => {
  if (psychologist.assignedUniversityId) {
    return psychologist.assignedUniversityId;
  }
  const departement = getDepartementNumberFromString(psychologist.departement);

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
