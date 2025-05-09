import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('universities', (table) => {
    table.text('billingEmail');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('universities', (table) => {
    table.dropColumn('billingEmail');
  });
}
