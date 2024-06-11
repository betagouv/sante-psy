import React from 'react';
import { getUnivYear } from 'services/date';
import { Badge } from '@dataesr/react-dsfr';
import getBadgeInfos from 'src/utils/badges';
import useScreenSize from 'src/utils/useScreenSize';
import styles from './badges.cssmodule.scss';

const badgesInfo = getBadgeInfos();

export const renderBadge = ({ badge, univYear, appointmentDate, isSmallScreen = false, isInactive = false }) => {
  const badgeUnivYear = univYear ?? getUnivYear(appointmentDate);
  const badges = getBadgeInfos(isSmallScreen, badgeUnivYear);
  if (!badge || badge === badges.other.key) {
    return null;
  }

  const { icon, text, severity, className, tooltip } = badges[badge];
  const inactiveBadge = isInactive ? styles.inactiveBadge : '';

  return text && (
    <>
      {tooltip ? 
        <div className={styles.hoverElement}>
          <span className={styles.tooltip}>{tooltip}</span>
          <Badge icon={icon} text={text} type={severity} className={`${className} ${styles.badge} ${inactiveBadge}`} />
        </div>
        :
        <Badge icon={icon} text={text} type={severity} className={`${className} ${styles.badge} ${inactiveBadge}`} />
      }
    </>
);
};

const Badges = ({ badges, univYear}) => {
  const isSmallScreen = useScreenSize();

  const isInactive = badges && badges.includes(badgesInfo.inactive.key)

  return (
    <div className={styles.badgeWrapper} data-test-id="etudiant-badges">
      {badges.map(badge => (
        renderBadge({ badge, univYear, isSmallScreen, isInactive })
      ))}
    </div>
  );
};

export default Badges;
