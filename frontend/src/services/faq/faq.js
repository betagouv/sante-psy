const agreement = require('./psychologue/agreement');
const connection = require('./psychologue/connection');
const psyEligibility = require('./psychologue/eligibility');
const process = require('./psychologue/process');
const registration = require('./psychologue/registration');
const reimbursement = require('./psychologue/reimbursement');
const retraction = require('./psychologue/retraction');
const psySession = require('./psychologue/session');
const billing = require('./psychologue/billing');
const doctor = require('./doctor');
const eligibility = require('./student/eligibility');
const payement = require('./student/payement');
const session = require('./student/session');

module.exports = {
  agreement,
  connection,
  psyEligibility,
  process,
  registration,
  reimbursement,
  retraction,
  psySession,
  billing,
  doctor,
  eligibility,
  payement,
  session,
};
