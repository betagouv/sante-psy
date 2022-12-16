import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('students', (table) => {
    table.boolean('doctorAppointment');
    table.boolean('doctorAppointment2');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('students', (table) => {
    table.dropColumn('doctorAppointment');
    table.dropColumn('doctorAppointment2');
  });
}
