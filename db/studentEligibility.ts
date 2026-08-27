import { Eligibility, EligibilityStatus } from '../types/Eligibility';
import { Student } from '../types/Student';
import { getStartUnivYearStr } from '../utils/univYears';
import db from './db';
import { studentEligibilityTable } from './tables';

const getStudentEligibilityStatus = async (
  student: Student,
  univYear: string,
): Promise<EligibilityStatus> => {
  const studentEligibility = await db(studentEligibilityTable)
    .where({
      student_id: student.id,
      univ_year: univYear,
    })
    .first();

  if (studentEligibility) {
    return studentEligibility.validated_by_team ? 'ELIGIBLE' : 'NOT_ELIGIBLE';
  }

  if (student.api_ines_check) {
    return 'ELIGIBLE';
  }

  return 'PENDING';
};

export const isStudentProfileComplete = (
  student: Student,
  univYear: string,
): boolean => {
  const startUnivYear = getStartUnivYearStr(univYear);
  return (
    !!student.last_update_personal_data &&
    new Date(student.last_update_personal_data) >= startUnivYear
  );
};

export const getStudentEligibility = async (
  student: Student,
  univYear: string,
): Promise<Eligibility> => {
  const eligibility = {} as Eligibility;

  if (univYear === '2025-2026') {
    return {
      status: 'ELIGIBLE',
      isProfileComplete: true,
      canPsyDeclareAppointment: true,
    };
  }

  eligibility.status = await getStudentEligibilityStatus(student, univYear);

  eligibility.isProfileComplete = isStudentProfileComplete(student, univYear);

  return {
    ...eligibility,
    canPsyDeclareAppointment:
      eligibility.isProfileComplete && eligibility.status === 'ELIGIBLE',
  };
};

export const isStudentEligible = async (
  student: Student,
  univYear: string,
): Promise<boolean> => {
  const eligibility = await getStudentEligibility(student, univYear);
  return eligibility.status === 'ELIGIBLE';
};
