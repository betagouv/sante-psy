import React from 'react';
import { getUnivYear } from 'services/date';
import { Badge } from '@dataesr/react-dsfr';
import allBadges from 'src/utils/badges';
import styles from './generateBadges.cssmodule.scss';

const generateBadgeStyles = (badge, appointmentDate, isSmallScreen) => {
  let univYear = null;

  // todo : replace appointmentDate by univYear for appointmentBadges
  if (
    appointmentDate
    && badge === allBadges().exceeded.key
  ) {
    univYear = getUnivYear(appointmentDate);
  }
  if (
    appointmentDate
    && badge === 'exceeded'
  ) {
    univYear = appointmentDate;
  }

  return allBadges(isSmallScreen, univYear)[badge];
};

const renderBadge = ({ badge, appointmentDate, isSmallScreen }) => {
  if (!badge || badge === allBadges().other.key) {
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
