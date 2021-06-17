exports.up = function (knex) {
  const promises = [];
  promises.push(knex.schema.table('appointments', (table) => {
    table.foreign('psychologistId').references('psychologists.dossierNumber');
    table.foreign('patientId').references('patients.id');
  }));
  promises.push(knex.schema.table('patients', (table) => {
    table.foreign('psychologistId').references('psychologists.dossierNumber');
  }));
  promises.push(knex.schema.table('psychologists', (table) => {
    table.foreign('assignedUniversityId').references('universities.id');
  }));
  return Promise.all(promises);
};

exports.down = function (knex) {
  const promises = [];

  promises.push(knex.schema.table('appointments', (table) => {
    table.dropForeign('patientId');
    table.dropForeign('psychologistId');
  }));
  promises.push(knex.schema.table('patients', (table) => {
    table.dropForeign('psychologistId');
  }));
  promises.push(knex.schema.table('psychologists', (table) => {
    table.dropForeign('assignedUniversityId');
  }));
  return Promise.all(promises);
};
