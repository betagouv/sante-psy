import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('patients', (table) => {
    table.text('doctorEmail');
    table.date('dateOfPrescription');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('patients', (table) => {
    table.dropColumn('doctorEmail');
    table.dropColumn('dateOfPrescription');
  });
}
