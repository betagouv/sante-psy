const crypto = require('crypto');
const config = require('./config');

module.exports.hash = function hash(logs = '') {
  return `hash ${crypto.createHmac('sha256', config.secretLogs)
    .update(logs.toLowerCase())
    .digest('hex')}`;
};
