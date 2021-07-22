import universityPayments from '../jobs/universityPayments';

const summaryJobs = {
  cronTime: '0 8 1 * *', // first of the month : https://crontab.guru/#0_8_1_*_*
  onTick: universityPayments.sendSummaryToUniversities,
  start: true,
  timeZone: 'Europe/Paris',
  isActive: config.featureSendSummary,
  name: 'Send monthly appoitment summaries to universities',
};

export default [summaryJobs];
