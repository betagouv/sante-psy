const crypto = require('crypto');
const config = require('./config');

module.exports.hashForLogs = function hashForLogs(logs = '') {
  return `hash ${crypto.createHmac('sha256', config.secretLogs)
    .update(logs.toLowerCase())
    .digest('hex')}`;
};
