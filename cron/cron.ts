import cron from 'cron';
import config from '../utils/config';
import sentry from '../utils/sentry';
import activation from './definitions/activation';
import automation from './definitions/automation';
import demarchesSimplifiees from './definitions/demarchesSimplifiees';
import summary from './definitions/summary';

// Desactivate debug log for production as they are a bit too verbose
if (!config.activateDebug) {
  console.log('console.debug is not active - thanks to ACTIVATE_DEBUG_LOG env variable');
  console.debug = () => {};
}

sentry.initCaptureConsole();

const jobs = activation
  .concat(automation)
  .concat(demarchesSimplifiees)
  .concat(summary);

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
