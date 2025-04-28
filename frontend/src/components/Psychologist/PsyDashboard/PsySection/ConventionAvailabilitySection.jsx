import React from 'react';
import { Button } from '@dataesr/react-dsfr';
import { useNavigate } from 'react-router-dom';

import { formatStringToDDMMYYYY } from 'services/date';
import styles from './psySection.cssmodule.scss';

const ConventionAvailabilitySection = ({ user }) => {
  const navigate = useNavigate();

  const greenCircleIcon = '/images/icons/icon-available-psy.svg';
  const orangeCircleIcon = '/images/icons/icon-unavailable-psy.svg';
  const redCircleIcon = '/images/icons/icon-invisible-psy.svg';

  const renderPsychologistAvailability = () => {
    if (user.inactiveUntil) {
      const isAlwaysInactive = user.inactiveUntil.startsWith('9999');
      return (
        <span>
          <img src={isAlwaysInactive ? redCircleIcon : orangeCircleIcon} alt="inactive icon" />
          <span className={styles.inactiveTexts}>
            <p>Invisible dans l&apos;annuaire</p>
            <p className={styles.inactiveSubtext}>
              {isAlwaysInactive
                ? "Les étudiants ne peuvent plus vous voir dans l'annuaire"
                : `Date de fin : ${formatStringToDDMMYYYY(user.inactiveUntil)}`}
            </p>
          </span>
        </span>
      );
    }

    return (
      <span>
        <img src={greenCircleIcon} alt="green circle" />
        <p>
          <b>Disponible</b>
          {' '}
          dans l&apos;annuaire
        </p>
      </span>
    );
  };

  return (
    <section className={styles.psyDashboardCard}>
      <Button
        id="show-convention-form"
        data-test-id="show-convention-form"
        secondary
        className={styles.psyDashboardConvention}
        onClick={() => navigate('/psychologue/ma-convention')}
        icon="ri-edit-line"
        iconPosition="right"
      >
        {user.convention && user.convention.isConventionSigned ? (
          <span>
            <img src={greenCircleIcon} alt="green circle" />
            <p>
              Convention :
              {' '}
              <b>Signée</b>
            </p>
          </span>
        ) : (
          <span>
            <img src={redCircleIcon} alt="red circle" />
            <p>
              Convention :
              {' '}
              <b>Pas encore signée</b>
            </p>
          </span>
        )}
      </Button>
      <Button
        secondary
        className={styles.psyDashboardAvailability}
        onClick={() => navigate('/psychologue/ma-disponibilite/')}
        icon="ri-edit-line"
        iconPosition="right"
        id="show-availability-form"
        data-test-id="show-availability-form"
      >
        {renderPsychologistAvailability()}
      </Button>
    </section>
  );
};

export default ConventionAvailabilitySection;
