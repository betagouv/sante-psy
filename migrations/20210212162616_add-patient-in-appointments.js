
exports.up = function(knex) {
  return knex.schema.table('appointments', function (table) {
    table.text('patientName').notNullable().defaultTo('');
  })
};

exports.down = function(knex) {
  return knex.schema.table('appointments', function (table) {
    table.dropColumn('patientName');
  })
};
