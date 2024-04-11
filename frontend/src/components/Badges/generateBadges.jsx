import React from 'react';
import { getUnivYear } from 'services/date';
import { Badge } from '@dataesr/react-dsfr';
import getBadgeInfos from 'src/utils/badges';
import styles from './generateBadges.cssmodule.scss';

const renderBadge = ({ badge, univYear, appointmentDate, isSmallScreen = false }) => {
  const badgeUnivYear = univYear ?? getUnivYear(appointmentDate);
  const badges = getBadgeInfos(isSmallScreen, badgeUnivYear);

  if (!badge || badge === badges.other.key) {
    return null;
  }

  const { icon, text, severity } = badges[badge];

  return <Badge icon={icon} text={text} type={severity} className={styles.badgeWrapper} />;
};

export default renderBadge;
