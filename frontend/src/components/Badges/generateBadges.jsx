import React from 'react';
import { getUnivYear } from 'services/date';
import { Badge } from '@dataesr/react-dsfr';
import appointmentBadges from 'src/utils/badges';

const generateBadgeStyles = (badge, appointmentDate) => {
  let univYear = null;
  if (
    appointmentDate
    && badge === appointmentBadges.exceeded
    && appointmentDate
  ) {
    univYear = getUnivYear(appointmentDate);
  }
  const badgeStyles = {
    first: {
      text: '1re séance',
      severity: 'info',
      icon: 'fr-icon-info-fill fr-icon--sm',
    },
    max: {
      text: 'Maximum de séances atteint',
      severity: 'warning',
      icon: 'fr-icon-warning-fill fr-icon--sm',
    },
    before_max: {
      text: 'Avant-dernière séance',
      severity: 'info',
      icon: 'fr-icon-info-fill fr-icon--sm',
    },
    exceeded: {
      text: `Excès de séances ${univYear || ''}`,
      severity: 'warning',
      icon: 'fr-icon-warning-fill fr-icon--sm',
    },
    student_infos: {
      text: 'Dossier étudiant à compléter',
      severity: 'info',
      icon: 'fr-icon-info-fill fr-icon--sm',
    },
    prescription_infos: {
      text: "Lettre d'orientation à compléter",
      severity: 'new',
      icon: 'fr-icon-info-fill fr-icon--sm',
    },
  };
  return badgeStyles[badge];
};

const renderBadge = ({ badge, appointmentDate }) => {
  if (!badge || badge === appointmentBadges.other) {
    return null;
  }

  const { icon, text, severity } = generateBadgeStyles(badge, appointmentDate);

  return <Badge icon={icon} text={text} type={severity} />;
};

export default renderBadge;
