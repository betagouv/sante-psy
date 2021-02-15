const cron = require('cron');
const { importDataFromDSToPG } = require("./importDataFromDS")
const config = require('../utils/config');

const jobs = [ {
  cronTime: "* * * * *", // https://crontab.guru/every-30-minutes - "*/30 * * * *"
  onTick: importDataFromDSToPG,
  start: true,
  timeZone: "Europe/Paris",
  isActive: true, //config.featureImportData,
  name: "Import data from DS API to PG",
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