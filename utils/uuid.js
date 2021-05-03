const { v5: uuidv5 } = require('uuid');
const config = require('./config');

const generateUuidFromString = (id) => uuidv5(id, config.uuidNamespace);
module.exports.generateUuidFromString = generateUuidFromString;

module.exports.randomUuid = function randomUuid(random = Math.random().toString()) {
  return generateUuidFromString(random);
};
