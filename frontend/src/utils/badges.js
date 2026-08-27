const getBadgeInfos = (isSmallScreen, univYear) => ({
  first: {
    key: 'first',
    text: '1re séance',
    severity: 'info',
    icon: 'fr-icon-info-fill fr-icon--sm',
  },
  max: {
    key: 'max',
    text: isSmallScreen ? 'Max' : 'Maximum de séances atteint',
    severity: 'warning',
    icon: 'fr-icon-warning-fill fr-icon--sm',
  },
  before_max: {
    key: 'before_max',
    text: isSmallScreen ? 'Avant-dernière' : 'Avant-dernière séance',
    severity: 'info',
    icon: 'fr-icon-info-fill fr-icon--sm',
  },
  exceeded: {
    key: 'exceeded',
    text: isSmallScreen ? 'Excès' : `Excès de séances ${univYear}`,
    severity: 'warning',
    icon: 'fr-icon-warning-fill fr-icon--sm',
  },
  other_psychologist: {
    key: 'other_psychologist',
    text: isSmallScreen ? 'Autre psy' : 'Autre psychologue',
    severity: 'info',
    icon: 'fr-icon-info-fill fr-icon--sm',
    className: 'fr-badge--purple-glycine',
  },
  no_student_account: {
    key: 'no_student_account',
    text: 'Pas de compte étudiant',
    severity: 'error',
    icon: 'fr-icon-warning-fill fr-icon--sm',
  },
  completed: {
    key: 'completed',
    text: 'à jour',
    severity: 'success',
    icon: 'fr-icon-success-fill fr-icon--sm',
  },
  new_rules: {
    key: 'new_rules',
    text: isSmallScreen ? 'Nouveau tarif' : 'Nouveau tarif 50€',
    severity: 'info',
    icon: 'fr-icon-success-fill fr-icon--sm',
    tooltip:
      'A partir du 1er juillet 2024, toutes les séances sont comptabilisées 50€, le nombre maximal de séances passe à 12 au lieu de 8',
  },
  other: { key: 'other' },
  switch_rule_notice: {
    key: 'switch_rule_notice',
    tooltip:
      'A partir du 1er juillet 2024, toutes les séances sont comptabilisées 50€, le nombre maximal de séances passe à 12 au lieu de 8',
  },
  inactive: { key: 'inactive' },
  pending_eligibility: {
    key: 'pending_eligibility',
    text: "En cours d'instruction",
    severity: 'warning',
    icon: 'fr-icon-warning-fill fr-icon--sm',
    tooltip: "L'équipe SPE évalue l'éligibilité de cet étudiant.",
  },
  not_eligible: {
    key: 'not_eligible',
    text: 'Non éligible',
    severity: 'error',
    icon: 'fr-icon-warning-fill fr-icon--sm',
    tooltip: "Cet étudiant n'est pas éligible au dispositif SPE.",
  },
  incomplete_profile: {
    key: 'incomplete_profile',
    text: 'Profil incomplet',
    severity: 'warning',
    icon: 'fr-icon-warning-fill fr-icon--sm',
    tooltip:
      "Cet étudiant n'a pas mis à jour son profil pour l'année scolaire en cours.",
  },
  check_certif: {
    key: 'check_certif',
    text: 'Document à valider',
    severity: 'info',
    icon: 'fr-icon-info-fill fr-icon--sm',
    tooltip:
      "Cet étudiant n'a pas encore effectué de séances cette année. Il vous sera demandé de valider le document fourni par l'étudiant au moment de déclarer la première séance.",
  },
});

export default getBadgeInfos;
