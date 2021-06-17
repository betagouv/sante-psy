exports.up = function (knex) {
  const promises = [];
  promises.push(knex.schema.table('appointments', (table) => {
    table.index('psychologistId');
    table.index('patientId');
  }));
  promises.push(knex.schema.table('psychologists', (table) => {
    table.index(['archived', 'state', 'active']);
    table.index('assignedUniversityId');
  }));
  promises.push(knex.schema.table('patients', (table) => {
    table.index('psychologistId');
    table.index(['psychologistId', 'deleted']);
  }));
  return Promise.all(promises);
};

exports.down = function (knex) {
  const promises = [];
  promises.push(knex.schema.table('appointments', (table) => {
    table.dropIndex('psychologistId');
    table.dropIndex('patientId');
  }));
  promises.push(knex.schema.table('psychologists', (table) => {
    table.dropIndex(['archived', 'state', 'active']);
    table.dropIndex('assignedUniversityId');
  }));
  promises.push(knex.schema.table('patients', (table) => {
    table.dropIndex('psychologistId');
    table.dropIndex(['psychologistId', 'deleted']);
  }));
  return Promise.all(promises);
};
