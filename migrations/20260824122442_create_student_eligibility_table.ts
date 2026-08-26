import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('student_eligibility', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));

    table
      .uuid('student_id')
      .notNullable()
      .references('id')
      .inTable('students')
      .onDelete('CASCADE');

    table.string('univ_year', 9).notNullable(); // format '2025-2026'
    table.boolean('validated_by_team').notNullable().defaultTo(false);
    table.text('comment').nullable();
    table.timestamps(true, true);
    table.unique(['student_id', 'univ_year']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('student_eligibility');
}
