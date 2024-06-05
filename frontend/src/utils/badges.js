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
  student_ine: {
    key: 'student_ine',
    text: isSmallScreen ? 'INE' : 'numéro INE absent',
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

export default getBadgeInfos;
