import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('students', (table) => {
    table.boolean('letter');
    table.boolean('appointment');
    table.integer('referral');
    table.timestamp('updatedAt');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('student', (table) => {
    table.dropColumn('letter');
    table.dropColumn('appointment');
    table.dropColumn('referral');
    table.dropColumn('updatedAt');
  });
}
