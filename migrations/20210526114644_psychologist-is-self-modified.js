const dbPsychologists = require('../db/psychologists');

exports.up = function (knex) {
  return knex.schema.table(dbPsychologists.psychologistsTable, (table) => {
    table.boolean('isSelfModified').default(false);
  });
};

exports.down = function (knex) {
  return knex.schema.table(dbPsychologists.psychologistsTable, (table) => {
    table.dropColumn('isSelfModified');
  });
};
