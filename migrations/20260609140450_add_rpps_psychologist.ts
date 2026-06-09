import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('psychologists', (table) => {
    table.string('rpps', 15).nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('psychologists', (table) => {
    table.dropColumn('rpps');
  });
}
