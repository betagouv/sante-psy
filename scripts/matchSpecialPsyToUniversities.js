const dbUniversities = require('../db/universities');
const dbPsychologists = require('../db/psychologists');
const psyToUni = require('./psyToUni');

/**
 * Update a list of special psy from a excel sheet to match them with a university
 * can be run and rerun again
 */
const run = async (dryRun) => {
  console.log('Match special psychologists to universities...');
  if (dryRun) {
    console.log('WARNING: dry-run mode on! (no changes will be applied)');
  }

  try {
    const universities = await dbUniversities.getUniversities();
    const psyFromDb = await dbPsychologists.getAcceptedPsychologists([
      'personalEmail',
      'dossierNumber',
      'assignedUniversityId',
    ]);

    const statsAssignmentDone = [];
    const statsNoUniFound = [];
    const statsNoChange = [];
    const psyFoundInDb = psyFromDb.filter((psy) => psyToUni[psy.personalEmail] !== undefined);
    const emailPsyFromDb = psyFromDb.map((p) => p.personalEmail);
    const statsNoPsyFound = Object.keys(psyToUni).filter((psy) => emailPsyFromDb.includes(psy) === false);

    const needToWait = psyFoundInDb
    .map((psy) => {
      const universityIdToAssign = dbUniversities.getUniversityId(universities, psyToUni[psy.personalEmail]);
      if (!universityIdToAssign) {
        statsNoUniFound.push(psyToUni[psy.personalEmail]);
        return Promise.resolve();
      }

      if (psy.assignedUniversityId === universityIdToAssign) {
        statsNoChange.push(psy.personalEmail);
        return Promise.resolve();
      }

      statsAssignmentDone.push({
        psy: psy.personalEmail,
        uniFrom: dbUniversities.getUniversityName(universities, psy.assignedUniversityId),
        uniTo: dbUniversities.getUniversityName(universities, universityIdToAssign),
      });

      if (dryRun) {
        return Promise.resolve();
      }
      return dbPsychologists.saveAssignedUniversity(psy.dossierNumber, universityIdToAssign);
    });

    await Promise.all(needToWait);

    console.log('\nPsy found in database for', psyFoundInDb.length, 'lines');
    console.log('\nNo psy found for', statsNoPsyFound.length, 'lines:', statsNoPsyFound);
    console.log('\nNo university found for', statsNoUniFound.length, 'lines:', statsNoUniFound);
    console.log('\nNo changes for', statsNoChange.length, 'psys:', statsNoChange);
    console.log('\nNew assignments done for', statsAssignmentDone.length, 'psys:', statsAssignmentDone);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(2);
  }
};

if (process.argv.length > 2 && process.argv[2] !== '--dry-run') {
  console.log("Invalid arg - did you mean '--dry-run'?");
  process.exit(1);
}

const dryRun = process.argv.length > 2 && process.argv[2] === '--dry-run';
run(dryRun);
