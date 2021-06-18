exports.up = function (knex) {
  return knex.schema
    .alterTable('appointments', (table) => {
      table.string('psychologistId').notNullable().alter();
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable('appointments', (table) => {
      table.string('psychologistId').nullable().alter();
    });
};
