import cron from 'cron';
import cronDemarchesSimplifiees from './cronDemarchesSimplifiees';
import cronUniversityPayments from './cronUniversityPayments';
import config from '../utils/config';
import sentry from '../utils/sentry';
import cronPsychologists from './cronPsychologists';

// Desactivate debug log for production as they are a bit too verbose
if (!config.activateDebug) {
  console.log('console.debug is not active - thanks to ACTIVATE_DEBUG_LOG env variable');
  console.debug = () => {};
}

sentry.initCaptureConsole();

const jobs = [
  {
    cronTime: '0 8 1 * *', // first of the month : https://crontab.guru/#0_8_1_*_*
    onTick: cronUniversityPayments.sendSummaryToUniversities,
    start: true,
    timeZone: 'Europe/Paris',
    isActive: config.featureSendSummary,
    name: 'Send monthly appoitment summaries to universities',
  },
  {
    cronTime: '*/5 * * * *', // every 5 minutes
    onTick: cronDemarchesSimplifiees.importLatestDataFromDSToPG,
    start: true,
    timeZone: 'Europe/Paris',
    isActive: config.featureImportData,
    name: 'Import latest data from DS API to PG',
  },
  {
    cronTime: '0 */3 * * *', // every 3 hours
    onTick: cronDemarchesSimplifiees.importEveryDataFromDSToPG,
    start: true,
    runOnInit: true,
    timeZone: 'Europe/Paris',
    isActive: config.featureImportData,
    name: 'Import ALL data from DS API to PG',
  },
  {
    cronTime: '0 9 * * 1-5', // every weekday at 9am
    onTick: cronDemarchesSimplifiees.checkForMultipleAcceptedDossiers,
    start: true,
    timeZone: 'Europe/Paris',
    isActive: config.featureImportData,
    name: 'checkForMultipleAcceptedDossiers',
  },
  {
    cronTime: '0 12 * * 3', // Every wednesday at noon
    onTick: cronDemarchesSimplifiees.autoAcceptPsychologists,
    start: true,
    timeZone: 'Europe/Paris',
    isActive: config.featureAutoAccept,
    name: 'Auto accept psychologist from designated universities in DS',
  },
  {
    cronTime: '0 10 * * 1-5', // every weekday at 10am
    onTick: cronDemarchesSimplifiees.autoVerifyPsychologists,
    start: true,
    timeZone: 'Europe/Paris',
    isActive: config.featureAutoVerify,
    name: 'Auto verify psychologist in DS',
  },
  {
    cronTime: '0 */6 * * *', // every 6 hours
    onTick: cronPsychologists.reactivatePsychologists,
    start: true,
    runOnInit: true,
    timeZone: 'Europe/Paris',
    name: 'Check active boolean on every Psychologist',
  },
];

let activeJobs = 0;
jobs.forEach((job) => {
  if (job.isActive) {
    console.log(`🚀 The job "${job.name}" is ON ${job.cronTime}`);
    new cron.CronJob(job);
    activeJobs++;
  } else {
    console.log(`❌ The job "${job.name}" is OFF`);
  }
});

console.log(`Started ${activeJobs} cron jobs`);
