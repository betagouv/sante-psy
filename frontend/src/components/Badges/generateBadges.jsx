import React from 'react';
import { getUnivYear } from 'services/date';
import { Badge } from '@dataesr/react-dsfr';
import appointmentBadges from 'src/utils/badges';
import styles from './generateBadges.cssmodule.scss';

const generateBadgeStyles = (badge, appointmentDate, isSmallScreen) => {
  let univYear = null;

  // todo : replace appointmentDate by univYear for appointmentBadges

  if (
    appointmentDate
    && badge === appointmentBadges.exceeded
  ) {
    univYear = getUnivYear(appointmentDate);
  }
  if (
    appointmentDate
    && badge === 'exceeded'
  ) {
    univYear = appointmentDate;
  }

  const badgeStyles = {
    first: {
      text: '1re séance',
      severity: 'info',
      icon: 'fr-icon-info-fill fr-icon--sm',
    },
    max: {
      text: isSmallScreen ? 'Max' : 'Maximum de séances atteint',
      severity: 'warning',
      icon: 'fr-icon-warning-fill fr-icon--sm',
    },
    before_max: {
      text: 'Avant-dernière séance',
      severity: 'info',
      icon: 'fr-icon-info-fill fr-icon--sm',
    },
    exceeded: {
      text: isSmallScreen ? 'Excès' : `Excès de séances ${univYear || ''}`,
      severity: 'warning',
      icon: 'fr-icon-warning-fill fr-icon--sm',
    },
    student_infos: {
      text: isSmallScreen ? 'Dossier' : 'Dossier étudiant à compléter',
      severity: 'info',
      icon: 'fr-icon-info-fill fr-icon--sm',
    },
    prescription_infos: {
      text: isSmallScreen ? 'Lettre' : "Lettre d'orientation à compléter",
      severity: 'new',
      icon: 'fr-icon-info-fill fr-icon--sm',
    },
    completed: {
      text: 'à jour',
      severity: 'success',
      icon: 'fr-icon-success-fill fr-icon--sm',
    },
  };
  return badgeStyles[badge];
};

const renderBadge = ({ badge, appointmentDate, isSmallScreen }) => {
  if (!badge || badge === appointmentBadges.other) {
    return null;
  }

  const { icon, text, severity } = generateBadgeStyles(
    badge,
    appointmentDate,
    isSmallScreen,
  );

  return <Badge icon={icon} text={text} type={severity} className={styles.badgeWrapper} />;
};

export default renderBadge;
