import React from 'react';
import { Button } from '@codegouvfr/react-dsfr/Button';
import { useNavigate } from 'react-router-dom';
import string from 'services/string';

import styles from './psySection.cssmodule.scss';

const PsyCardInfo = ({ psychologist, user }) => {
  const navigate = useNavigate();

  return (
    <section className={styles.psyDashboardCard}>
      <div className={styles.psyDashboardCardFirstColumn}>
        <img
          src="/images/icons/psychologist-profile.svg"
          alt="icon of a person in a circle"
          className={styles.psyPersonIcon}
        />
        <b>
          {psychologist.firstNames} {psychologist.lastName}
        </b>
        {psychologist.active && (
          <Button
            id="show-public-profile-button"
            data-test-id="show-public-profile-button"
            iconId="fr-icon-eye-line"
            priority="secondary"
            onClick={() =>
              window.open(
                `/trouver-un-psychologue/${user.dossierNumber}`,
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            Voir profil public
          </Button>
        )}
        <b>
          {user.convention
            ? `Université ${user.convention.universityName}`
            : "Vous n'êtes rattaché à aucune université"}
        </b>
      </div>
      <div className={styles.psyDashboardCardSecondColumn}>
        <p>{psychologist.address}</p>
        <p>ADELI/RPPS : {psychologist.adeli}</p>
        <span className={styles.emailPhoneContainer}>
          <p>{psychologist.email}</p> <p>{psychologist.phone}</p>
        </span>
        <span>
          <Button
            priority="tertiary"
            onClick={() => {
              window.open(
                string.prefixUrl(psychologist.website),
                '_blank',
                'noopener,noreferrer',
              );
            }}
            iconId="ri-link"
          >
            Site web
          </Button>
          <Button
            priority="tertiary"
            iconId="ri-calendar-line"
            onClick={() => {
              window.open(
                string.prefixUrl(psychologist.appointmentLink),
                '_blank',
                'noopener,noreferrer',
              );
            }}
          >
            Site de prise de RDV
          </Button>
        </span>
        <Button
          priority="secondary"
          className={styles.buttonEdit}
          id="show-profile-form-button"
          data-test-id="show-profile-form-button"
          iconId="ri-edit-line"
          onClick={() => {
            navigate('/psychologue/modifier-profil/');
          }}
        >
          Modifier
        </Button>
      </div>
    </section>
  );
};

export default PsyCardInfo;
