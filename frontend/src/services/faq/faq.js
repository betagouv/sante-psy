const agreement = require('./psychologue/agreement');
const connection = require('./psychologue/connection');
const psyEligibility = require('./psychologue/eligibility');
const process = require('./psychologue/process');
const registration = require('./psychologue/registration');
const reimbursement = require('./psychologue/reimbursement');
const retractation = require('./psychologue/retractation');
const psySession = require('./psychologue/session');
const billing = require('./psychologue/billing');
const schoolEligibility = require('./school/eligibility');
const schoolBilling = require('./school/billing');
const schoolConvention = require('./school/convention');
const schoolJoin = require('./school/join');
const schoolStatistics = require('./school/statistics');
const eligibility = require('./student/eligibility');
const payment = require('./student/payment');
const session = require('./student/session');
const studentProcess = require('./student/process');

module.exports = {
  agreement,
  billing,
  connection,
  eligibility,
  psyEligibility,
  process,
  psySession,
  payment,
  registration,
  reimbursement,
  retractation,
  session,
  studentProcess,
  schoolBilling,
  schoolConvention,
  schoolEligibility,
  schoolJoin,
  schoolStatistics,
};
