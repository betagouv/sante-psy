const dbUniversities = require('../db/universities');
const dbPsychologists = require('../db/psychologists');
const demarchesSimplifiees = require('../utils/demarchesSimplifiees');
const departementToUniversityName = require('./departementToUniversityName');

const run = async () => {
  console.log('Match psychologists to universities...');
  const universities = await dbUniversities.getUniversities();
  console.log(`${universities.length} universities`);

  const psychologists = await dbPsychologists.getPsychologistsDeclaredUniversity();
  console.log(`${psychologists.length} psychologists`);

  const statsNoUniversityFound = {};
  const statsNoDepartementFound = [];
  const statsConflictingDeclaredUniversity = {};
  const statsAssignedWithoutProblem = [];
  const statsAlreadyAssigned = [];

  const needToWait = psychologists.map((psychologist) => {
    if (psychologist.assignedUniversityId) {
      // Don't rewrite assignedUniversityId if it's already written, in case we made changes by hand that should not be
      // overwritten by the script.
      console.log('Already assigned', psychologist.dossierNumber, 'to', psychologist.assignedUniversityId);
      statsAlreadyAssigned.push(psychologist.dossierNumber);

      return Promise.resolve();
    }

    // Find universityId for this psychologist
    const departement = demarchesSimplifiees.getDepartementNumberFromString(psychologist.departement);
    if (!departement) {
      console.log(`No departement found
          - psy id ${psychologist.dossierNumber}
          - ${psychologist.lastName} ${psychologist.firstNames}`);

      statsNoDepartementFound.push(psychologist.dossierNumber);

      return Promise.resolve();
    }
    const correspondingUniName = departementToUniversityName[departement];
    if (!correspondingUniName) {
      console.log(`No corresponding uni name found for
          - departement ${departement}`);

      return Promise.resolve();
    }
    const universityIdToAssign = dbUniversities.getUniversityId(universities, departementToUniversityName[departement]);

    if (!universityIdToAssign) {
      console.warn(`No university found for departement ${psychologist.departement}
      - psy id ${psychologist.dossierNumber}
      - ${psychologist.lastName} ${psychologist.firstNames}`);

      if (!statsNoUniversityFound[psychologist.departement]) {
        statsNoUniversityFound[psychologist.departement] = [];
      }
      statsNoUniversityFound[psychologist.departement].push(psychologist.dossierNumber);

      return Promise.resolve();
    }

    // If the psychologist declared another university, something is wrong ! Do not write assignedUniversityId.
    const noUniversityId = dbUniversities.getUniversityId(universities, '--- Aucune pour le moment');
    if (psychologist.declaredUniversityId
        && psychologist.declaredUniversityId !== noUniversityId // the psy declared "Aucune"
        && psychologist.declaredUniversityId !== universityIdToAssign) {
      console.log('Psy', psychologist.dossierNumber, 'already declared', psychologist.declaredUniversityId,
        'so will not assign', universityIdToAssign,
        dbUniversities.getUniversityName(universities, universityIdToAssign));

      if (!statsConflictingDeclaredUniversity[psychologist.departement]) {
        statsConflictingDeclaredUniversity[psychologist.departement] = [];
      }
      statsConflictingDeclaredUniversity[psychologist.departement].push(
        {
          psychologistId: psychologist.dossierNumber,
          psychologistEmail: psychologist.personalEmail,
          declaredUniversityId: psychologist.declaredUniversityId,
          declaredUniversityName: dbUniversities.getUniversityName(universities, psychologist.declaredUniversityId),
          universityIdToAssign,
          universityNameToAssign: dbUniversities.getUniversityName(universities, universityIdToAssign),
        },
      );
    }

    try {
      if (universityIdToAssign) {
        console.log('Assigned', psychologist.dossierNumber,
          'of departement', psychologist.departement,
          'to university', universityIdToAssign, dbUniversities.getUniversityName(universities, universityIdToAssign));
        statsAssignedWithoutProblem.push(psychologist.dossierNumber);
        return dbPsychologists.saveAssignedUniversity(psychologist.dossierNumber, universityIdToAssign);
      }
      return Promise.resolve();
    } catch (err) {
      console.error('Erreur de saveAssignedUniversity', err);
      throw new Error('Erreur de saveAssignedUniversity');
    }
  });

  await Promise.all(needToWait);

  console.log('------------');
  console.log('No university to assign automatically : ');
  Object.entries(statsNoUniversityFound).forEach(([departement, psyList]) => {
    console.log(departement, ': ', psyList.length, 'psys');
  });

  console.log('\nNo departement found :', statsNoDepartementFound.length, 'psys');

  console.log('\nConflict between declaredUniversity and assignedUniversity :', statsConflictingDeclaredUniversity);

  console.log('\nAssigned without problem :', statsAssignedWithoutProblem.length, 'psys');

  console.log('\nAlready assigned, so this script did nothing :', statsAlreadyAssigned.length, 'psys');

  // eslint-disable-next-line no-process-exit
  process.exit(1);
};

run();
