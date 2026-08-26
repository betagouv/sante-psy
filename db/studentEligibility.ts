import { Student } from '../types/Student';
import db from './db';
import { studentEligibilityTable } from './tables';

export const isStudentEligible = async (
  student: Student,
  univYear: string,
): Promise<boolean> => {
  if (student.api_ines_check) {
    return true;
  }
  const existingEligibility = await db(studentEligibilityTable)
    .where({ student_id: student.id, univ_year: univYear })
    .first();
  return Boolean(existingEligibility);
};
