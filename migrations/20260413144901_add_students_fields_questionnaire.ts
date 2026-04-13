import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.table('students', table => {
    table.boolean('has_accepted_cgu').notNullable().defaultTo(false);
    table.string('school_type').nullable();
    table.string('school_type_other').nullable();
    table.string('university_name').nullable();
    table.string('study_level').nullable();
    table.string('study_field').nullable();
    table.string('gender').nullable();
    table.string('school_postcode').nullable();
    table.string('living_postcode').nullable();
    table.string('how_did_you_know').nullable();
    table.string('how_did_you_know_other').nullable();
    table.boolean('notification_email').notNullable().defaultTo(false);
    table.boolean('notification_sms').notNullable().defaultTo(false);
    table.string('phone_number').nullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.table('students', table => {
    table.dropColumn('has_accepted_cgu');
    table.dropColumn('school_type');
    table.dropColumn('school_type_other');
    table.dropColumn('university_name');
    table.dropColumn('study_level');
    table.dropColumn('study_field');
    table.dropColumn('gender');
    table.dropColumn('school_postcode');
    table.dropColumn('living_postcode');
    table.dropColumn('how_did_you_know');
    table.dropColumn('how_did_you_know_other');
    table.dropColumn('notification_email');
    table.dropColumn('notification_sms');
    table.dropColumn('phone_number');
  });
}
