import demarchesSimplifiees from './jobs/demarchesSimplifiees';
import universityPayments from './jobs/universityPayments';
import psychologists from './jobs/psychologists';

const runJob = async (job) => {
  await job();
  process.exit(0);
};

if (process.argv.length < 3) {
  console.log('Please specify the cron you want to launch:');
  console.log('ts-node cron_jobs/launch.ts job_name');
  process.exit(1);
}

const cronJobs = {
  sendSummaryMail: universityPayments.sendSummaryToUniversities,
  importLatestDataFromDS: demarchesSimplifiees.importLatestDataFromDSToPG,
  importEveryDataFromDS: demarchesSimplifiees.importEveryDataFromDSToPG,
  checkForMultipleAcceptedDossiers: demarchesSimplifiees.checkForMultipleAcceptedDossiers,
  autoAcceptPsychologists: demarchesSimplifiees.autoAcceptPsychologists,
  autoVerifyPsychologists: demarchesSimplifiees.autoVerifyPsychologists,
  reactivatePsychologists: psychologists.reactivatePsychologists,
};

const jobName = process.argv[2];
const job = cronJobs[jobName];
if (job) {
  runJob(job);
} else {
  console.log(`The job ${process.argv[2]} does not exist !`);
  process.exit(2);
}
