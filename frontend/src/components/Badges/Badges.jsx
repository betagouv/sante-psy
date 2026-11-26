import React from 'react';
import { getUnivYear } from 'services/univYears';
import useScreenSize from 'src/utils/useScreenSize';
import getBadgeInfos from 'src/utils/badges';
import styles from './badges.cssmodule.scss';
import { Tooltip } from 'components/Tooltip/Tooltip';
import { Badge } from '@codegouvfr/react-dsfr/Badge';

export const renderBadge = ({
  badge,
  univYear,
  appointmentDate,
  isSmallScreen = false,
  isInactive = false,
}) => {
  const badgeUnivYear = univYear ?? getUnivYear(appointmentDate);
  const badges = getBadgeInfos(isSmallScreen, badgeUnivYear);
  if (!badge || badge === badges.other.key) {
    return null;
  }

  const { icon, text, severity, className, tooltip } = badges[badge];
  const inactiveBadge = isInactive ? styles.inactiveBadge : '';

  return (
    text && (
      <div>
        {tooltip ? (
          <Tooltip tooltip={tooltip}>
            <Badge
              icon={icon}
              severity={severity}
              className={`${className} ${styles.badge} ${inactiveBadge}`}
            >
              {text}
            </Badge>
          </Tooltip>
        ) : (
          <Badge
            icon={icon}
            severity={severity}
            className={`${className} ${styles.badge} ${inactiveBadge}`}
          >
            {text}
          </Badge>
        )}
      </div>
    )
  );
};

const Badges = ({ badges, univYear, isInactive = false }) => {
  const isSmallScreen = useScreenSize();

  return (
    <div className={styles.badgeWrapper} data-test-id="etudiant-badges">
      {badges.map((badge) =>
        renderBadge({ badge, univYear, isSmallScreen, isInactive }),
      )}
    </div>
  );
};

export default Badges;
