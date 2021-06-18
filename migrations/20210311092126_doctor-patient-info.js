exports.up = function (knex) {
  return knex.schema.table('patients', (table) => {
    table.text('doctorName');
    table.text('doctorAddress');
    table.string('doctorPhone');
  });
};

exports.down = function (knex) {
  return knex.schema.table('patients', (table) => {
    table.dropColumn('doctorName');
    table.dropColumn('doctorAddress');
    table.dropColumn('doctorPhone');
  });
};
