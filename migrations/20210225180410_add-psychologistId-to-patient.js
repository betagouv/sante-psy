exports.up = function (knex) {
  return knex.schema.table('patients', (table) => {
    table.uuid('psychologistId').notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table('patients', (table) => {
    table.dropColumn('psychologistId');
  });
};
