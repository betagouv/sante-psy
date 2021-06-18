exports.up = function (knex) {
  return knex.schema.table('psychologists', (table) => {
    table.dropColumn('declaredUniversityId');
  });
};

exports.down = function (knex) {
  return knex.schema.table('psychologists', (table) => {
    table.uuid('declaredUniversityId');
  });
};
