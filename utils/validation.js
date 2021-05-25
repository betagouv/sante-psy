const { validationResult } = require('express-validator');

module.exports.checkErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    errors.array().forEach((error) => {
      console.debug('checkErrors form', error.msg);
      req.error = error.msg;
    });
    return false;
  }
  return true;
};

// Does not work for "oneOf" matchers
module.exports.hasErrorsForField = (req, fieldName) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return false;
  }
  const hasErrorForField = errors.array().some((errorObj) => {
    if (errorObj.param === fieldName) {
      return true;
    }
    return false;
  });
  return hasErrorForField;
};
