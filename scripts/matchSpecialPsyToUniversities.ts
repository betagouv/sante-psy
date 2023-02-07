import db from '../db/db';
import dbUniversities from '../db/universities';
import dbPsychologists from '../db/psychologists';
import { psychologistsTable } from '../db/tables';
import psyToUni from './psyToUni';
import { DossierState } from '../types/DossierState';

/**
 * Update a list of special psy from a excel sheet to match them with a university
 * can be run and rerun again
 */
const matchPsyToUni = async (dryRun): Promise<void> => {
  console.log('Match special psychologists to universities...');
  if (dryRun) {
    console.log('WARNING: dry-run mode on! (no changes will be applied)');
  }

  try {
    const statsAssignmentDone = [];
    const statsNoUniFound = [];
    const statsNoChange = [];
    const psysFoundInDb = [];
    const statsNoPsyFound = [];

    const universities = await dbUniversities.getAll();
    const psyFromDb = await db.column('personalEmail', 'dossierNumber', 'assignedUniversityId')
      .select().from(psychologistsTable)
      .where('state', DossierState.accepte);

    Object.keys(psyToUni).forEach((psyFromFile) => {
      const psyFoundInDb = psyFromDb.find((psy) => psy.personalEmail === psyFromFile);
      if (psyFoundInDb) {
        psysFoundInDb.push(psyFoundInDb);
      } else {
        statsNoPsyFound.push(psyFromFile);
      }
    });

    const needToWait = psysFoundInDb
    .map((psy) => {
      const universityToAssign = universities.find(
        (uni) => uni.name.toString().trim() === psyToUni[psy.personalEmail].toString().trim(),
      );
      if (!universityToAssign) {
        statsNoUniFound.push(psyToUni[psy.personalEmail]);
        return Promise.resolve(0);
      }

      if (psy.assignedUniversityId === universityToAssign.id) {
        statsNoChange.push(psy.personalEmail);
        return Promise.resolve(0);
      }

      const currentUniversity = universities.find((uni) => uni.id === psy.assignedUniversityId);
      statsAssignmentDone.push({
        psy: psy.personalEmail,
        uniFrom: currentUniversity ? currentUniversity.name : '',
        uniTo: universityToAssign.name,
      });

      if (dryRun) {
        return Promise.resolve(0);
      }
      return dbPsychologists.saveAssignedUniversity(psy.dossierNumber, universityToAssign.id);
    });

    await Promise.all(needToWait);

    console.log('\nPsy found in database for', psysFoundInDb.length, 'lines');
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
matchPsyToUni(dryRun);
