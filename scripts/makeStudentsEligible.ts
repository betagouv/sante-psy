/* eslint-disable no-await-in-loop */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import db from '../db/db';
import { studentEligibilityTable, studentsTable } from '../db/tables';
import { sendWelcomeMail } from '../services/email/sendWelcomeEmail';
import { testArgUnivYear } from './utils';

const makeStudentsEligible = async (
  univYear: string,
  studentIds: string[],
  comment: string | null,
): Promise<void> => {
  console.log('++ Script - Making students eligible for univ year: ', univYear);
  console.log('++ Script - Student ids: ', studentIds);
  if (comment) {
    console.log('++ Script - Comment:', comment);
  }

  try {
    testArgUnivYear(univYear);

    if (studentIds.length === 0) {
      console.log('No student ids provided!');
      process.exit(1);
    }

    const existingStudents = await db(studentsTable)
      .whereIn('id', studentIds)
      .select('id', 'email');
    const existingStudentIds = existingStudents.map((s) => s.id);
    const emailByStudentId = new Map(
      existingStudents.map((s) => [s.id, s.email]),
    );

    const missingStudentIds = studentIds.filter(
      (id) => !existingStudentIds.includes(id),
    );
    if (missingStudentIds.length > 0) {
      console.log('Some student ids were not found!');
      console.log('Missing:', missingStudentIds);
      process.exit(1);
    }

    const rows = studentIds.map((studentId) => ({
      student_id: studentId,
      univ_year: univYear,
      validated_by_team: true,
      comment: comment || null,
    }));

    const alreadyEligibleRows = await db(studentEligibilityTable)
      .whereIn(
        'student_id',
        rows.map((r) => r.student_id),
      )
      .andWhere('univ_year', univYear)
      .andWhere('validated_by_team', true)
      .select('student_id');

    const alreadyEligibleStudentIds = new Set(
      alreadyEligibleRows.map((r) => r.student_id),
    );

    const result = await db(studentEligibilityTable)
      .insert(rows)
      .onConflict(['student_id', 'univ_year'])
      .merge({
        validated_by_team: true,
        comment: comment || null,
      })
      .returning('*');

    const newlyInserted = result.filter(
      (r) => !alreadyEligibleStudentIds.has(r.student_id),
    );
    const updated = result.filter((r) =>
      alreadyEligibleStudentIds.has(r.student_id),
    );

    console.log(
      `Done! ${rows.length} student(s) eligible for ${univYear}.` +
        ` ${newlyInserted.length} new - ${updated.length} updated`,
    );

    for (const r of newlyInserted) {
      const email = emailByStudentId.get(r.student_id);
      if (!email) {
        console.warn(`No email found for student ${r.student_id}`);
        continue;
      }

      try {
        await sendWelcomeMail(email);
      } catch (err) {
        console.error(`Failed to send to ${email}`, err);
      }
    }

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(2);
  }
};

if (process.argv.length <= 3) {
  console.log('Invalid: missing arguments');
  console.log(
    'Usage: ts-node makeStudentsEligible.ts <univYear> <studentId1,studentId2,...> [comment]',
  );
  console.log(
    'Example: ts-node makeStudentsEligible.ts 2026-2027 abc-123,def-456 "validated after review"',
  );
  process.exit(1);
}

const univYearArg = process.argv[2];
const studentIdsArg = process.argv[3];
const commentArg = process.argv[4] || null;

const studentIds = studentIdsArg.split(',').map((id) => id.trim());

makeStudentsEligible(univYearArg, studentIds, commentArg);
