// Note : this migration can only run successfully on an empty DB.
// (We don't need to support full DB because there is no data in prod.)
exports.up = function(knex) {
  return knex.schema
    .createTable('patients', (table) => {
      table.increments("id").primary() // todo uuid ?
      table.string("firstNames", 255).notNullable()
      table.string("lastName", 255).notNullable()
      table.string("INE", 11)
    }).then(() => {
      knex.insert
      return knex.schema.table('appointments', function(table) {
        table.integer('patientId').unsigned().notNullable()
        table.foreign('patientId').references('id').inTable('patients');
        table.dropColumn('patientName');
      });
    });
};

exports.down = function(knex) {
  return knex.schema.table('appointments', function (table) {
    table.dropColumn('patientId');
  }).then(() => {
    return knex.schema.dropTable('patients');
  });
};
