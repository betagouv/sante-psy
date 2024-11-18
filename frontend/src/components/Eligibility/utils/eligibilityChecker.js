import { EligibilityOptions } from "./eligibilitySteps";

export const checkEligibility = (answers) => {
  const { TRAINING, ELIGIBILITY } = EligibilityOptions;

  const eligibleTrainings = [TRAINING.BTS, TRAINING.UNIVERSITY_DIPLOMA];
  const eligibleOtherOptions = [ELIGIBILITY.INE, ELIGIBILITY.CVEC, ELIGIBILITY.BOTH];

  return (
    eligibleTrainings.includes(answers.formation) ||
    eligibleOtherOptions.includes(answers.otherEligibility) ||
    eligibleTrainings.includes(answers.formationClose) ||
    eligibleOtherOptions.includes(answers.otherEligibilityClose) ||
    eligibleTrainings.includes(answers.formationSchool) ||
    eligibleOtherOptions.includes(answers.otherEligibilitySchool) ||
    eligibleTrainings.includes(answers.formationConsult) ||
    eligibleOtherOptions.includes(answers.otherEligibilityConsult)
  );
};

export const checkIneligibility = (answers) => {
  const { STUDENT, ELIGIBILITY } = EligibilityOptions;

  const ineligibleStudentOptions = [STUDENT.NO];
  const ineligibleOtherOptions = [ELIGIBILITY.NONE];

  return (
    ineligibleStudentOptions.includes(answers.isStudent) ||
    ineligibleStudentOptions.includes(answers.isStudentClose) ||
    ineligibleOtherOptions.includes(answers.otherEligibility) ||
    ineligibleOtherOptions.includes(answers.otherEligibilityClose) ||
    ineligibleOtherOptions.includes(answers.otherEligibilitySchool) ||
    ineligibleOtherOptions.includes(answers.otherEligibilityConsult)
  );
};
