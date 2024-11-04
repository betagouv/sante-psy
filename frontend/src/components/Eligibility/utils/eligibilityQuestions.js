export const EligibilityQuestionIds = {
  WHO_FOR: "whoFor",
  ARE_YOU_STUDENT: "areYouStudent",
  STUDENT_STATUS: "studentStatus",
  WHAT_TRAINING: "whatTraining",
  CLOSE_TRAINING: "closeTraining",
  SCHOOL_TRAINING: "schoolTraining",
  CONSULTANT_TRAINING: "consultantTraining",
  ELIGIBILITY_OPTIONS: "eligibilityOptions",
};

export const EligibilityOptions = {
  WHO_FOR: {
    ME: "Pour moi-même",
    CLOSE: "Pour un proche",
    SCHOOL: "Pour une école",
    CONSULTANT: "Pour un étudiant en consultation",
  },
  TRAINING: {
    BTS: "BTS",
    UNIVERSITY_DIPLOMA: "Diplôme universitaire",
    OTHER: "Autre",
  },
  STUDENT: {
    YES: "Oui",
    NO: "Non",
  },
  ELIGIBILITY: {
    INE: "Un numéro INE",
    CVEC: "Une cotisation CVEC",
    BOTH: "Les deux",
    NONE: "Aucun",
  },
};

export const EligibilityQuestions = {
  [EligibilityQuestionIds.WHO_FOR]: {
    question: "Pour qui souhaitez-vous vérifier l'éligibilité ?",
    options: Object.values(EligibilityOptions.WHO_FOR),
  },
  [EligibilityQuestionIds.ARE_YOU_STUDENT]: {
    question: "Êtes-vous étudiant ?",
    options: Object.values(EligibilityOptions.STUDENT),
  },
  [EligibilityQuestionIds.STUDENT_STATUS]: {
    question: "Votre proche est-il étudiant ?",
    options: Object.values(EligibilityOptions.STUDENT),
  },
  [EligibilityQuestionIds.WHAT_TRAINING]: {
    question: "Quelle est votre formation ?",
    options: Object.values(EligibilityOptions.TRAINING),
  },
  [EligibilityQuestionIds.CLOSE_TRAINING]: {
    question: "Quelle est la formation suivie par votre proche ?",
    options: Object.values(EligibilityOptions.TRAINING),
  },
  [EligibilityQuestionIds.SCHOOL_TRAINING]: {
    question: "Quelle est la formation proposée par votre école ?",
    options: Object.values(EligibilityOptions.TRAINING),
  },
  [EligibilityQuestionIds.CONSULTANT_TRAINING]: {
    question: "Quelle est la formation suivie par l'étudiant ?",
    options: Object.values(EligibilityOptions.TRAINING),
  },
  [EligibilityQuestionIds.ELIGIBILITY_OPTIONS]: {
    question: "Avez-vous :",
    options: Object.values(EligibilityOptions.ELIGIBILITY),
  },
};
