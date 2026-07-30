import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('universities', (table) => {
    table.string('uai', 12).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('universities', (table) => {
    table.dropColumn('uai');
  });
}
