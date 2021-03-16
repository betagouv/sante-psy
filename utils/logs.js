const config = require('./config');
const crypto = require('crypto')

module.exports.hashForLogs = function hashForLogs(logs = "") {
  return 'hash ' + crypto.createHmac('sha256', config.secret)
    .update(logs.toLowerCase())
    .digest('hex')
}
