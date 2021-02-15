const cron = require('cron');
const importDataFromDSToPG = require("./importDataFromDS")
const config = require('../utils/config');

const jobs = [ {
  cronTime: "*/30 * * * *", // https://crontab.guru/every-30-minutes
  onTick: importDataFromDSToPG,
  start: true,
  timeZone: "Europe/Paris",
  isActive: config.featureImportData,
  name: "Import data from DS API to PG",
}
]

let activeJobs = 0
for (const job of jobs) {
  if (job.isActive) {
    console.log(`🚀 The job "${job.name}" is ON`)
    new cron.CronJob(job)
    activeJobs++
  } else {
    console.log(`❌ The job "${job.name}" is OFF`)
  }
}

console.log(`Started ${activeJobs} cron jobs`)