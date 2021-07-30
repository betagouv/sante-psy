import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('universities', (table) => {
    table.string('siret');
    table.text('address');
    table.string('postal_code');
    table.string('city');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('universities', (table) => {
    table.dropColumn('siret');
    table.dropColumn('address');
    table.dropColumn('postal_code');
    table.dropColumn('city');
  });
}
