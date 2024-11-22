export const EligibilityOptions = {
  WHO_FOR: [
    { value: 'ME', label: 'Pour moi-même' },
    { value: 'CLOSE', label: 'Pour un proche' },
    { value: 'SCHOOL', label: 'Pour une école' },
    { value: 'CONSULTANT', label: 'Pour un étudiant en consultation' },
  ],
  TRAINING: [
    { value: 'BTS', label: 'BTS', eligible: true },
    { value: 'UNIVERSITY_DIPLOMA', label: 'Formation universitaire', eligible: true },
    { value: 'OTHER', label: 'Autre' },
  ],
  STUDENT: [
    { value: 'YES', label: 'Oui' },
    { value: 'NO', label: 'Non', eligible: false },
  ],
  ELIGIBILITY: [
    { value: 'INE', label: 'Un numéro INE', tooltip: "Il fait 11 caractères (chiffres et lettres). Il peut être présent sur la carte d'étudiant ou sur le certificat de scolarité.", eligible: true },
    { value: 'CVEC', label: 'Une cotisation CVEC', tooltip: "Chaque étudiant inscrit en formation initiale dans un établissement d'enseignement supérieur doit obligatoirement obtenir, préalablement à son inscription, son attestation d'acquittement de la Contribution de vie étudiante et de campus (CVEC), par paiement ou exonération (ex : boursier).", eligible: true },
    { value: 'BOTH', label: 'Les deux', eligible: true },
    { value: 'NONE', label: 'Aucun', eligible: false },
  ],
};

export const EligibilitySteps = [
  {
    id: 'STEP_1',
    getQuestion: () => 'Bonjour, vous souhaitez savoir si vous pouvez bénéficier du dispositif Santé Psy Étudiant. Faites le test :',
    getOptions: () => Object.values(EligibilityOptions.WHO_FOR),
    next: () => 'STEP_2',
  },
  {
    id: 'STEP_2',
    getQuestion: answers => {
      const previousAnswer = answers.STEP_1.value;
      if (previousAnswer === 'ME') return 'Êtes-vous étudiant ?';
      if (previousAnswer === 'CLOSE') return 'Votre proche est-il étudiant ?';
      if (previousAnswer === 'SCHOOL') return 'Quelle est la formation proposée par votre école ?';
      return "Quelle est la formation suivie par l'étudiant ?";
    },
    getOptions: answers => {
      const previousAnswer = answers.STEP_1.value;
      if (['ME', 'CLOSE'].includes(previousAnswer)) return Object.values(EligibilityOptions.STUDENT);
      return Object.values(EligibilityOptions.TRAINING);
    },
    next: (answer, answers) => {
      const previousAnswer = answers.STEP_1.value;
      if (['ME', 'CLOSE'].includes(previousAnswer)) {
        return answer.value === 'YES' ? 'STEP_3' : 'INELIGIBLE';
      }
      return 'STEP_3';
    },
  },
  {
    id: 'STEP_3',
    getQuestion: answers => {
      const previousAnswer = answers.STEP_1.value;
      if (previousAnswer === 'ME') return 'Quelle est votre formation ?';
      if (previousAnswer === 'CLOSE') return 'Quelle est la formation suivie par votre proche ?';
      if (previousAnswer === 'SCHOOL') return 'Les étudiants ont-ils :';
      return "L'étudiant a-t-il :";
    },
    getOptions: answers => {
      const previousAnswer = answers.STEP_1.value;
      if (['ME', 'CLOSE'].includes(previousAnswer)) {
        return Object.values(EligibilityOptions.TRAINING);
      }
      return Object.values(EligibilityOptions.ELIGIBILITY);
    },
    next: answer => {
      if (answer.value === 'OTHER') {
        return 'STEP_4';
      }
      return null;
    },
  },
  {
    id: 'STEP_4',
    getQuestion: answers => {
      const previousAnswer = answers.STEP_1.value;
      if (previousAnswer === 'ME') return 'Avez-vous :';
      if (previousAnswer === 'CLOSE') return 'Votre proche a-t-il :';
      return '';
    },
    getOptions: answers => {
      const previousAnswer = answers.STEP_1.value;
      if (['ME', 'CLOSE'].includes(previousAnswer)) {
        return Object.values(EligibilityOptions.ELIGIBILITY);
      }
      return [];
    },
    next: () => null,
  },
];
