import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('patients', (table) => {
    table.dropColumn('otherStudentNumber');
    table.dropColumn('universityId');
    table.dropColumn('doctorPhone');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('patients', (table) => {
    table.string('otherStudentNumber', 255);
    table.uuid('universityId');
    table.string('doctorPhone');
  });
}
