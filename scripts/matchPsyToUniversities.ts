import db from '../db/db';
import dbUniversities from '../db/universities';
import dbPsychologists from '../db/psychologists';
import { psychologistsTable } from '../db/tables';
import department from '../utils/department';
import departementToUniversityName from '../utils/departementToUniversityName';

/**
 * Update psychologists assigned university according to their department
 * can be run and rerun again
 */
const matchPsyToUni = async (dryRun): Promise<void> => {
  console.log('Match psychologists to universities...');
  if (dryRun) {
    console.log('WARNING: dry-run mode on! (no changes will be applied)');
  }

  try {
    const statsAssignmentDone = [];
    const statsNoDepartmentFound = [];
    const statsNoUniFound = [];
    const statsNoChange = [];

    const universities = await dbUniversities.getAll();
    const psychologists = await db.column('personalEmail', 'dossierNumber', 'departement', 'assignedUniversityId')
      .select().from(psychologistsTable);

    const needToWait = psychologists
      .map((psy) => {
        const departement = department.getNumberFromString(psy.departement);
        if (!departement) {
          statsNoDepartmentFound.push(psy.dossierNumber);
          return Promise.resolve(0);
        }

        const correspondingUniName: string = departementToUniversityName[departement];
        if (!correspondingUniName) {
          statsNoUniFound.push(departement);
          return Promise.resolve(0);
        }

        const universityToAssign = universities.find((uni) => uni.name.trim() === correspondingUniName);
        if (!universityToAssign) {
          statsNoUniFound.push(departement);
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

    console.log('\nAccepted psys:', psychologists.length);
    console.log('\nNo department found for', statsNoDepartmentFound.length, 'psys:', statsNoDepartmentFound);
    console.log('\nNo university found for', statsNoUniFound.length, 'psys');
    console.log('\nNo changes for', statsNoChange.length, 'psys');
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
