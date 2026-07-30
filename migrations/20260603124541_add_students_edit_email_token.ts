import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('students', table => {
    table.string('pending_email').nullable();
    table.string('pending_email_token').nullable();
    table.timestamp('pending_email_expiration_date').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('students', table => {
    table.dropColumn('pending_email');
    table.dropColumn('pending_email_token');
    table.dropColumn('pending_email_expiration_date');
  });
}
