const dbUniversities = require('../db/universities');
const dbPsychologists = require('../db/psychologists');
const psyToUni = require('./psyToUni');

/**
 * Update a list of special psy from a excel sheet to match them with a university
 * can be run and rerun again
 */
const run = async () => {
  console.log('Match psychologists to universities...');
  const universities = await dbUniversities.getUniversities();
  console.log(`${universities.length} universities`);
  const psychologists = await dbPsychologists.getPsychologistsDeclaredUniversity();

  const statsNoEmailFound = [];
  const statsConflictingDeclaredUniversity = [];

  const specialCasePsychologists = psychologists.filter((psy) => psyToUni[psy.personalEmail] !== undefined);
  const needToWait = specialCasePsychologists
    .map((psy) => {
      const psychologist = { ...psy };
      const universityIdToAssign = dbUniversities.getUniversityId(universities, psyToUni[psy.personalEmail]);
      if (!universityIdToAssign) {
        console.warn(`No university found for psy ${psy.personalEmail}
        - psy id ${psychologist.dossierNumber}`);

        statsNoEmailFound.push(psychologist);
        return Promise.resolve();
      }
      if (psychologist.declaredUniversityId !== null && psychologist.declaredUniversityId !== universityIdToAssign) {
        console.log('Psy', psychologist.dossierNumber, 'already declared', psychologist.declaredUniversityId,
          'but was assigned', universityIdToAssign,
          dbUniversities.getUniversityName(universities, universityIdToAssign));

        psychologist.assignedUniversity = universityIdToAssign;
        statsConflictingDeclaredUniversity.push(psychologist);
      }
      return dbPsychologists.saveAssignedUniversity(psychologist.dossierNumber, universityIdToAssign);
    });

  await Promise.all(needToWait);
  console.log(`${specialCasePsychologists.length} special case psychologists done`);
  console.log('\nNo personalEmail found :', statsNoEmailFound.length, 'psys');
  console.log('\nConflict between declaredUniversity and assignedUniversity :', statsConflictingDeclaredUniversity);

  // eslint-disable-next-line no-process-exit
  process.exit(1);
};

run();
