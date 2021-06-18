/**
 * to join appointments.psychologistId with psychologists.id
 * @param {*} knex 
 */
exports.up = function (knex) {
  return knex.schema.alterTable('appointments', (table) => {
    table.uuid('psychologistId').alter();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable('appointments', (table) => {
    table.string('psychologistId').alter();
  });
};
