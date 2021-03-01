const { validationResult } = require('express-validator');

module.exports.checkErrors = (req) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    errors.array().forEach(error => {
      req.flash('error', error.msg)
    })
    return false
  }
  return true
}
