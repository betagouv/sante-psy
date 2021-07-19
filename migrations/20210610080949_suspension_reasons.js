exports.up = function (knex) {
  return knex.schema.createTable('suspension_reasons', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('psychologistId')
      .references('dossierNumber')
      .inTable('psychologists');
    table.text('reason').notNullable();
    table.date('until').notNullable();
    table.datetime('createdAt').notNullable().defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('suspension_reasons');
};
