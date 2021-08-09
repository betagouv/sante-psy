import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void[]> {
  const alters = [knex.schema.alterTable('appointments', (table) => {
    table.date('appointmentDate').alter();
  }),
  knex.schema.alterTable('psychologists', (table) => {
    table.date('inactiveUntil').alter();
  }),
  knex.schema.alterTable('patients', (table) => {
    table.date('dateOfBirth').alter();
  }),
  ];

  return Promise.all(alters);
}

export async function down(knex: Knex): Promise<void[]> {
  const alters = [knex.schema.alterTable('appointments', (table) => {
    table.dateTime('appointmentDate').alter();
  }),
  knex.schema.alterTable('psychologists', (table) => {
    table.dateTime('inactiveUntil').alter();
  }),
  knex.schema.alterTable('patients', (table) => {
    table.dateTime('dateOfBirth').alter();
  }),
  ];

  return Promise.all(alters);
}
