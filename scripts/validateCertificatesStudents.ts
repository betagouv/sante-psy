import db from '../db/db';
import { studentEligibilityTable, studentsTable } from '../db/tables';

const UNIV_YEAR_REGEX = /^\d{4}-\d{4}$/;

const validateCertificatesStudents = async (
  univYear: string,
  studentIds: string[],
  comment: string | null,
): Promise<void> => {
  console.log('Validating certificates for univ year: ', univYear);
  console.log('Student ids: ', studentIds);
  if (comment) {
    console.log('Comment:', comment);
  }

  try {
    if (!UNIV_YEAR_REGEX.test(univYear)) {
      console.log('Invalid univ year format!');
      console.log('Help: format should be YYYY-YYYY, e.g. 2026-2027');
      process.exit(1);
    }

    if (studentIds.length === 0) {
      console.log('No student ids provided!');
      process.exit(1);
    }

    const existingStudents = await db(studentsTable)
      .whereIn('id', studentIds)
      .select('id');
    const existingStudentIds = existingStudents.map((s) => s.id);

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

    await db(studentEligibilityTable)
      .insert(rows)
      .onConflict(['student_id', 'univ_year'])
      .merge({
        validated_by_team: true,
        comment: comment || null,
      });

    console.log(`Done! ${rows.length} student(s) validated for ${univYear}.`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(2);
  }
};

if (process.argv.length <= 3) {
  console.log('Invalid: missing arguments');
  console.log(
    'Usage: ts-node validateCertificatesStudents.ts <univYear> <studentId1,studentId2,...> [comment]',
  );
  console.log(
    'Example: ts-node validateCertificatesStudents.ts 2026-2027 abc-123,def-456 "validated after review"',
  );
  process.exit(1);
}

const univYearArg = process.argv[2];
const studentIdsArg = process.argv[3];
const commentArg = process.argv[4] || null;

const studentIds = studentIdsArg.split(',').map((id) => id.trim());

validateCertificatesStudents(univYearArg, studentIds, commentArg);
