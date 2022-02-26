import cronDemarchesSimplifiees from './cronDemarchesSimplifiees';
import cronUniversityPayments from './cronUniversityPayments';
import cronPsychologists from './cronPsychologists';
import cronStudents from './cronStudents';

const runJob = async (job): Promise<void> => {
  await job();
  process.exit(0);
};

if (process.argv.length < 3) {
  console.log('Please specify the cron you want to launch:');
  console.log('ts-node cron_jobs/launch.ts job_name');
  process.exit(1);
}

const cronJobs = {
  sendStudentsMailJ3: cronStudents.sendStudentsMailJ3,
  sendStudentsMailJ10: cronStudents.sendStudentsMailJ10,
  sendStudentsMailJ30: cronStudents.sendStudentsMailJ30,
  sendSummaryMail: cronUniversityPayments.sendSummaryToUniversities,
  importLatestDataFromDS: cronDemarchesSimplifiees.importLatestDataFromDSToPG,
  importEveryDataFromDS: cronDemarchesSimplifiees.importEveryDataFromDSToPG,
  checkForMultipleAcceptedDossiers: cronDemarchesSimplifiees.checkForMultipleAcceptedDossiers,
  autoAcceptPsychologists: cronDemarchesSimplifiees.autoAcceptPsychologists,
  autoVerifyPsychologists: cronDemarchesSimplifiees.autoVerifyPsychologists,
  reactivatePsychologists: cronPsychologists.reactivatePsychologists,
};

const jobName = process.argv[2];
const job = cronJobs[jobName];
if (job) {
  runJob(job);
} else {
  console.log(`The job ${process.argv[2]} does not exist !`);
  process.exit(2);
}
