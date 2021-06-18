const columnBirthday = 'dateOfBirth';
exports.up = function (knex) {
  console.log(`Adding ${columnBirthday} column to 'patients'`);
  return knex.schema.table('patients', (table) => {
    table.datetime(columnBirthday);
  });
};

exports.down = function (knex) {
  return knex.schema.table('patients', (table) => {
    table.dropColumn(columnBirthday);
  });
};
