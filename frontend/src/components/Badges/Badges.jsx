import React from 'react';
import { getUnivYear } from 'services/date';
import { Badge } from '@dataesr/react-dsfr';
import getBadgeInfos from 'src/utils/badges';
import useScreenSize from 'src/utils/useScreenSize';
import styles from './badges.cssmodule.scss';

export const renderBadge = ({ badge, univYear, appointmentDate, isSmallScreen = false }) => {
  const badgeUnivYear = univYear ?? getUnivYear(appointmentDate);
  const badges = getBadgeInfos(isSmallScreen, badgeUnivYear);
  if (!badge || badge === badges.other.key) {
    return null;
  }

  const { icon, text, severity, className } = badges[badge];

  return <Badge icon={icon} text={text} type={severity} className={`${className} ${styles.badge}`} />;
};

const Badges = ({ badges, univYear }) => {
  const isSmallScreen = useScreenSize();

  return (
    <div className={styles.badgeWrapper} data-test-id="etudiant-badges">
      {badges.map(badge => (
        renderBadge({ badge, univYear, isSmallScreen })
      ))}
    </div>
  );
};

export default Badges;
