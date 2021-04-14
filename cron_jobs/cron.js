const cron = require('cron');
const cronDemarchesSimplifiees  = require("./cronDemarchesSimplifiees")
const cronUniversityPayments  = require("./cronUniversityPayments")
const config = require('../utils/config');
const sentry = require('../utils/sentry');

sentry.initCaptureConsole();

const jobs = [{
  cronTime: "* 8 1 * * ", // every first of the month at 8 AM
  onTick: cronUniversityPayments.SendSummaryToUniversities,
  start: true,
  timeZone: "Europe/Paris",
  isActive: config.featureSendSummary,
  name: "Send monthly appoitment summaries to universities",
},
{
  cronTime: "*/5 * * * *", // every 5 minutes
  onTick: cronDemarchesSimplifiees.importLatestDataFromDSToPG,
  start: true,
  timeZone: "Europe/Paris",
  isActive: config.featureImportData,
  name: "Import latest data from DS API to PG",
},
{
  cronTime: "0 */3 * * *", // every 3 hours
  onTick: cronDemarchesSimplifiees.importEveryDataFromDSToPG,
  start: true,
  runOnInit: true,
  timeZone: "Europe/Paris",
  isActive: config.featureImportData,
  name: "Import ALL data from DS API to PG",
},
{
  cronTime: "0 9 * * 1-5", // every weekday at 9am
  onTick: cronDemarchesSimplifiees.checkForMultipleAcceptedDossiers,
  start: true,
  timeZone: "Europe/Paris",
  isActive: config.featureImportData,
  name: "checkForMultipleAcceptedDossiers",
}
]

let activeJobs = 0
for (const job of jobs) {
  if (job.isActive) {
    console.log(`🚀 The job "${job.name}" is ON ${job.cronTime}`)
    new cron.CronJob(job)
    activeJobs++
  } else {
    console.log(`❌ The job "${job.name}" is OFF`)
  }
}

console.log(`Started ${activeJobs} cron jobs`)