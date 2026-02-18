const agreement = require('./psychologue/agreement');
const connection = require('./psychologue/connection');
const psyEligibility = require('./psychologue/eligibility');
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
const studentSpace = require('./studentSpace/space');
const problem = require('./student/problem');
const session = require('./student/session');
const studentProcess = require('./student/process');

module.exports = {
  agreement,
  billing,
  connection,
  eligibility,
  psyEligibility,
  psySession,
  problem,
  registration,
  reimbursement,
  retractation,
  session,
  studentProcess,
  studentSpace,
  schoolBilling,
  schoolConvention,
  schoolEligibility,
  schoolJoin,
  schoolStatistics,
};
