import { EligibilityOptions } from "./eligibilityQuestions";

export const checkEligibility = (answers) => {
  const { TRAINING, ELIGIBILITY } = EligibilityOptions;
  
  return (
    answers.formation === TRAINING.BTS ||
    answers.formation === TRAINING.UNIVERSITY_DIPLOMA ||
    answers.otherEligibility === ELIGIBILITY.INE ||
    answers.otherEligibility === ELIGIBILITY.CVEC ||
    answers.otherEligibility === ELIGIBILITY.BOTH ||
    answers.formationClose === TRAINING.BTS ||
    answers.formationClose === TRAINING.UNIVERSITY_DIPLOMA ||
    answers.otherEligibilityClose === ELIGIBILITY.INE ||
    answers.otherEligibilityClose === ELIGIBILITY.CVEC ||
    answers.otherEligibilityClose === ELIGIBILITY.BOTH ||
    answers.formationSchool === TRAINING.BTS ||
    answers.formationSchool === TRAINING.UNIVERSITY_DIPLOMA ||
    answers.otherEligibilitySchool === ELIGIBILITY.INE ||
    answers.otherEligibilitySchool === ELIGIBILITY.CVEC ||
    answers.otherEligibilitySchool === ELIGIBILITY.BOTH ||
    answers.formationConsult === TRAINING.BTS ||
    answers.formationConsult === TRAINING.UNIVERSITY_DIPLOMA ||
    answers.otherEligibilityConsult === ELIGIBILITY.INE ||
    answers.otherEligibilityConsult === ELIGIBILITY.CVEC ||
    answers.otherEligibilityConsult === ELIGIBILITY.BOTH
  );
};

export const checkIneligibility = (answers) => {
  const { STUDENT, ELIGIBILITY } = EligibilityOptions;

  return (
    answers.isStudent === STUDENT.NO ||
    answers.isStudentClose === STUDENT.NO ||
    answers.otherEligibility === ELIGIBILITY.NONE ||
    answers.otherEligibilityClose === ELIGIBILITY.NONE ||
    answers.otherEligibilitySchool === ELIGIBILITY.NONE ||
    answers.otherEligibilityConsult === ELIGIBILITY.NONE
  );
};
