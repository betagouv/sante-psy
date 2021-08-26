import newPatientsInstitution from './newPatientsInstitution.json';
import { patientsTable } from '../db/tables';
import db from '../db/db';
import { Patient } from '../types/Patient';

const clean = async (dryRun: boolean): Promise<void> => {
  const patients: Patient[] = await db(patientsTable);
  const updates = patients.map(async (patient) => {
    const match = newPatientsInstitution[patient.institutionName];
    if (match && match.go) {
      console.log(`update ${patient.institutionName} to ${match.target}`);
      if (!dryRun) {
        await db(patientsTable)
          .where({ id: patient.id })
          .update({
            institutionName: match.target,
          });
      }
    }
    return Promise.resolve();
  });

  await Promise.all(updates);

  console.log('Done');
  process.exit(0);
};

if (process.argv.length > 2 && process.argv[2] !== '--dry-run') {
  console.log("Invalid arg - did you mean '--dry-run'?");
  process.exit(1);
}

const dryRun = process.argv.length > 2 && process.argv[2] === '--dry-run';
clean(dryRun);
