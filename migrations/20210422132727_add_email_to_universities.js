exports.up = function (knex) {
  return knex.schema.table('universities', (table) => {
    table.text('emailSSU');
    table.text('emailUniversity');
  });
};

exports.down = function (knex) {
  return knex.schema.table('universities', (table) => {
    table.dropColumn('emailSSU');
    table.dropColumn('emailUniversity');
  });
};
