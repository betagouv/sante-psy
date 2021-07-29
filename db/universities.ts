import date from '../utils/date';
import departementToUniversityName from '../utils/departementToUniversityName';
import { universitiesTable } from './tables';
import department from '../utils/department';
import { Psychologist } from '../types/Psychologist';
import db from './db';
import { University } from '../types/University';

const upsertMany = async (universitiesList: University[]): Promise<void> => {
  console.log(`UPSERT of ${universitiesList.length} universities....`);
  const updatedAt = date.now(); // use to perform UPSERT in PG

  const upsertArray = universitiesList.map((university) => {
    const upsertingKey = 'id';

    try {
      return db(universitiesTable)
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
      return Promise.resolve([]);
    }
  });

  await Promise.all(upsertArray);
  console.log('UPSERT universities done');
};

const getAll = async (): Promise<University[]> => {
  try {
    return db.select('id', 'name', 'emailSSU', 'emailUniversity')
        .from(universitiesTable);
  } catch (err) {
    console.error('Impossible de récupérer les universités', err);
    throw new Error('Impossible de récupérer les universités');
  }
};

const getAllOrderByName = async (): Promise<University[]> => {
  try {
    return db.select('id', 'name', 'emailSSU', 'emailUniversity')
        .from(universitiesTable)
        .orderBy('name');
  } catch (err) {
    console.error('Impossible de récupérer les universités', err);
    throw new Error('Impossible de récupérer les universités');
  }
};

const insertByName = async (name: string): Promise<University> => {
  try {
    const universityArray = await db(universitiesTable).insert({
      name,
    }).returning('*');
    return universityArray[0];
  } catch (err) {
    console.error("Erreur de sauvegarde de l'université", err);
    throw new Error("Erreur de sauvegarde de l'université");
  }
};

const getAssignedUniversityId = (psychologist: Psychologist, universities: University[]): string | null => {
  if (psychologist.assignedUniversityId) {
    return psychologist.assignedUniversityId;
  }

  const departement = department.getNumberFromString(psychologist.departement);
  if (!departement) {
    console.log(`No departement found - psy id ${psychologist.dossierNumber}`);
    return null;
  }

  const correspondingUniName: string = departementToUniversityName[departement];
  if (!correspondingUniName) {
    console.log(`No corresponding uni name found for - departement ${departement}`);
    return null;
  }

  const foundUni = universities.find((uni) => uni.name.trim() === correspondingUniName);
  if (foundUni) {
    return foundUni.id;
  }
  return null;
};

const getEmailsTo = (university: University): string | undefined => {
  if (university.emailUniversity) {
    return university.emailUniversity.split(' ; ').join(',');
  }
  return university.emailSSU ? university.emailSSU.split(' ; ').join(',') : undefined;
};

export default {
  upsertMany,
  getAll,
  getAllOrderByName,
  getAssignedUniversityId,
  getEmailsTo,
  insertByName,
};
