/* eslint-disable func-names */
/**
 * some students number can be different than 11 chars
 * @param {*} knex 
 */
exports.up = function (knex) {
  return knex.schema.alterTable('patients', (table) => {
    table.string('INE', 50).alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('patients', (table) => {
    table.string('INE', 11).alter();
  });
};
