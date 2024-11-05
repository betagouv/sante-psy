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
    ME: { label: "Pour moi-même" },
    CLOSE: { label: "Pour un proche" },
    SCHOOL: { label: "Pour une école" },
    CONSULTANT: { label: "Pour un étudiant en consultation" },
  },
  TRAINING: {
    BTS: { label: "BTS" },
    UNIVERSITY_DIPLOMA: { label: "Diplôme universitaire" },
    OTHER: { label: "Autre" },
  },
  STUDENT: {
    YES: { label: "Oui" },
    NO: { label: "Non" },
  },
  ELIGIBILITY: {
    INE: { label: "Un numéro INE", tooltip: "Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d'étudiant ou sur le certificat de scolarité." },
    CVEC: { label: "Une cotisation CVEC", tooltip: "Chaque étudiant inscrit en formation initiale dans un établissement d'enseignement supérieur doit obligatoirement obtenir, préalablement à son inscription, son attestation d'acquittement de la Contribution de vie étudiante et de campus (CVEC), par paiement ou exonération (ex : boursier)." },
    BOTH: { label: "Les deux" },
    NONE: { label: "Aucun" },
  },
};

export const EligibilityQuestions = {
  [EligibilityQuestionIds.WHO_FOR]: {
    question: "Bonjour, vous souhaitez savoir si vous pouvez bénéficier du dispositif Santé Psy Étudiant. Pour qui souhaitez-vous vérifier l'éligibilité ?",
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
