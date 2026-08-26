import { Student } from '../types/Student';
import { getStartUnivYearStr } from '../utils/univYears';
import db from './db';
import { studentEligibilityTable } from './tables';
import s3Service from '../services/s3';

type Eligibility = {
  apiCheck: boolean;
  validatedByTeam?: boolean;
  questionnaire: boolean;
  uploadedDocument: boolean;
  canPsyDeclareAppointment: boolean;
};

export const getStudentEligibility = async (
  student: Student,
  univYear: string,
): Promise<Eligibility> => {
  const eligibility = {} as Eligibility;

  eligibility.apiCheck = Boolean(student.api_ines_check);
  const existingEligibility = await db(studentEligibilityTable)
    .where({
      student_id: student.id,
      validated_by_team: true,
      univ_year: univYear,
    })
    .first();
  eligibility.validatedByTeam = Boolean(existingEligibility);

  if (univYear === '2025-2026') {
    eligibility.questionnaire = true;
    eligibility.uploadedDocument = false;
    eligibility.canPsyDeclareAppointment = true;
    return eligibility;
  }

  // has student answered questionnaire since beginning of univ year ?
  const startUnivYear = getStartUnivYearStr(univYear);
  const hasStudentAnsweredQuestionnaire =
    !!student.last_update_personal_data &&
    new Date(student.last_update_personal_data) < startUnivYear;

  eligibility.questionnaire = hasStudentAnsweredQuestionnaire;

  // has student uploaded a document for univ year ?
  const documentExists = await s3Service.certificateExists(
    student.id,
    univYear,
  );
  eligibility.uploadedDocument = documentExists;

  return {
    ...eligibility,
    canPsyDeclareAppointment:
      eligibility.questionnaire && eligibility.uploadedDocument,
  };
};

export const isStudentEligible = async (
  student: Student,
  univYear: string,
): Promise<boolean> => {
  const eligibility = await getStudentEligibility(student, univYear);
  if (!eligibility.apiCheck && !eligibility.validatedByTeam) {
    return false;
  }
  return eligibility.questionnaire && eligibility.uploadedDocument;
};
