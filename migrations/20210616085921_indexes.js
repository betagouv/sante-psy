exports.up = function (knex) {
  const promises = [];
  promises.push(knex.schema.table('psychologists', (table) => {
    table.index(['archived', 'state', 'active']);
  }));
  promises.push(knex.schema.table('patients', (table) => {
    table.index(['psychologistId', 'deleted']);
  }));
  return Promise.all(promises);
};

exports.down = function (knex) {
  const promises = [];
  promises.push(knex.schema.table('psychologists', (table) => {
    table.dropIndex(['archived', 'state', 'active']);
  }));
  promises.push(knex.schema.table('patients', (table) => {
    table.dropIndex(['psychologistId', 'deleted']);
  }));
  return Promise.all(promises);
};
