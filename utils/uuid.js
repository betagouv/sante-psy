const { v5: uuidv5 } = require('uuid');
const config = require('./config');

module.exports.generateUuidFromString = (id) => {
  return uuidv5(id, config.namespace);
}