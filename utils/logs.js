const crypto = require('crypto')
const hash = crypto.createHash('sha256');
module.exports.hashForLogs = function hashForLogs(logs = "") {
  const hashed = hash.update(logs).copy().digest('hex');

  return 'hash ' + hashed;
}
