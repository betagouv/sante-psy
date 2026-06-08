import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('patients', (table) => {
    table.string('firstNames').nullable().alter();
    table.string('lastName').nullable().alter();

    table
      .uuid('student_id')
      .nullable()
      .references('id')
      .inTable('students')
      .onDelete('SET NULL');
  });

  // Partial unique index: only enforces uniqueness when student_id is NOT NULL
  await knex.raw(`
    CREATE UNIQUE INDEX uq_psy_student
    ON patients ("psychologistId", student_id)
    WHERE student_id IS NOT NULL
    AND (deleted IS NULL OR deleted = false)
  `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.raw('DROP INDEX IF EXISTS uq_psy_student');
  await knex.schema.alterTable('patients', (table) => {
    table.dropColumn('student_id');
  });
}
