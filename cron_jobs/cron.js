const cron = require('cron');
const { importDataFromDSToPG } = require("./importDataFromDS")
const config = require('../utils/config');

const jobs = [ {
  cronTime: "*/5 * * * *", // https://crontab.guru/every-5-minutes
  onTick: importDataFromDSToPG(false),
  start: true,
  timeZone: "Europe/Paris",
  isActive: config.featureImportData,
  name: "Import only the latest data from DS API to PG",
},{
  cronTime: "10 */2 * * *", // At minute 10 past every 2nd hour.
  onTick: importDataFromDSToPG(true),
  start: true,
  timeZone: "Europe/Paris",
  isActive: config.featureImportData,
  name: "Import ALL data from DS API to PG",
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