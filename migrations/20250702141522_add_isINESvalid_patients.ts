import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('patients', (table) => {
    table.boolean('isINESvalid').nullable();
    table.integer('countCertificatesSent').defaultTo(0);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('patients', (table) => {
    table.dropColumn('isINESvalid');
    table.dropColumn('countCertificatesSent');
  });
}
