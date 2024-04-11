const allBadges = (isSmallScreen, univYear) => ({
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
    text: 'Avant-dernière séance',
    severity: 'info',
    icon: 'fr-icon-info-fill fr-icon--sm',
  },
  exceeded: {
    key: 'exceeded',
    text: isSmallScreen ? 'Excès' : `Excès de séances ${univYear}`,
    severity: 'warning',
    icon: 'fr-icon-warning-fill fr-icon--sm',
  },
  student_infos: {
    key: 'student_infos',
    text: isSmallScreen ? 'Dossier' : 'Dossier étudiant à compléter',
    severity: 'info',
    icon: 'fr-icon-info-fill fr-icon--sm',
  },
  prescription_infos: {
    key: 'prescription_infos',
    text: isSmallScreen ? 'Lettre' : "Lettre d'orientation à compléter",
    severity: 'new',
    icon: 'fr-icon-info-fill fr-icon--sm',
  },
  completed: {
    key: 'completed',
    text: 'à jour',
    severity: 'success',
    icon: 'fr-icon-success-fill fr-icon--sm',
  },
  other: { key: 'other' },
});

export default allBadges;
